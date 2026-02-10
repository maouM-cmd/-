from datetime import timedelta

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotAllowed
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import MeterReadingCreateForm, PaymentCreateForm
from .models import Customer, Invoice, MeterReading
from .services import create_invoice_for_meter_reading, get_latest_meter_value


def dashboard(request):
    this_month = timezone.localdate().replace(day=1)
    active_customers = Customer.objects.filter(is_active=True).count()
    current_month_readings = MeterReading.objects.filter(reading_month=this_month).count()

    context = {
        "active_customers": active_customers,
        "unread_meter_count": max(active_customers - current_month_readings, 0),
        "unissued_invoice_count": MeterReading.objects.filter(invoice__isnull=True).count(),
        "unpaid_invoice_count": Invoice.objects.exclude(status="paid").count(),
    }
    return render(request, "core/dashboard.html", context)


def customer_list(request):
    customers = Customer.objects.order_by("customer_code")
    return render(request, "core/customer_list.html", {"customers": customers})


def meter_reading_list(request):
    readings = list(MeterReading.objects.select_related("customer").order_by("-reading_month"))
    for reading in readings:
        reading.generated_invoice = getattr(reading, "invoice", None)
    return render(request, "core/meter_reading_list.html", {"readings": readings})


def meter_reading_create(request):
    if request.method == "POST":
        form = MeterReadingCreateForm(request.POST)
        if form.is_valid():
            meter_reading = form.save(commit=False)
            meter_reading.input_user = request.user if request.user.is_authenticated else None
            if meter_reading.input_user is None:
                messages.error(request, "検針入力にはログインが必要です。管理画面からログインしてください。")
            else:
                meter_reading.save()
                messages.success(request, "検針データを登録しました。")
                return redirect("core:meter_reading_list")
    else:
        form = MeterReadingCreateForm()
        customer_id = request.GET.get("customer")
        if customer_id:
            customer = Customer.objects.filter(id=customer_id).first()
            if customer:
                form.fields["customer"].initial = customer
                form.fields["previous_value"].initial = get_latest_meter_value(customer)

    return render(request, "core/meter_reading_form.html", {"form": form})


def invoice_list(request):
    invoices = Invoice.objects.select_related("customer").order_by("-issue_date")
    return render(request, "core/invoice_list.html", {"invoices": invoices})


@login_required(login_url="/admin/login/")
def invoice_generate(request, meter_reading_id):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    meter_reading = get_object_or_404(MeterReading, id=meter_reading_id)
    if hasattr(meter_reading, "invoice"):
        messages.info(request, "この検針データの請求書は既に発行済みです。")
        return redirect("core:invoice_list")

    issue_date = timezone.localdate()
    due_date = issue_date + timedelta(days=14)

    try:
        invoice = create_invoice_for_meter_reading(meter_reading, issue_date=issue_date, due_date=due_date)
    except ValueError as exc:
        messages.error(request, str(exc))
        return redirect("core:meter_reading_list")

    messages.success(request, f"請求書 {invoice.invoice_no} を作成しました。")
    return redirect("core:invoice_list")


def payment_status_list(request):
    invoices = Invoice.objects.select_related("customer").order_by("status", "due_date")
    return render(request, "core/payment_status_list.html", {"invoices": invoices})


@login_required(login_url="/admin/login/")
def payment_create(request, invoice_id):
    invoice = get_object_or_404(Invoice, id=invoice_id)
    if request.method == "POST":
        form = PaymentCreateForm(request.POST)
        if form.is_valid():
            payment = form.save(commit=False)
            payment.invoice = invoice
            payment.save()
            messages.success(request, "入金を登録しました。")
            return redirect("core:payment_status_list")
    else:
        form = PaymentCreateForm(initial={"payment_amount": invoice.remaining_amount})

    return render(request, "core/payment_form.html", {"form": form, "invoice": invoice})
