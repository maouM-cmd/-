from django.shortcuts import render
from django.utils import timezone

from .models import Customer, Invoice, MeterReading


def dashboard(request):
    context = {
        "active_customers": Customer.objects.filter(is_active=True).count(),
        "unread_meter_count": Customer.objects.filter(is_active=True).count()
        - MeterReading.objects.filter(
            reading_month__year=timezone.now().year, reading_month__month=timezone.now().month
        ).count(),
        "unissued_invoice_count": MeterReading.objects.filter(invoice__isnull=True).count(),
        "unpaid_invoice_count": Invoice.objects.exclude(status="paid").count(),
    }
    return render(request, "core/dashboard.html", context)


def customer_list(request):
    customers = Customer.objects.order_by("customer_code")
    return render(request, "core/customer_list.html", {"customers": customers})


def meter_reading_list(request):
    readings = MeterReading.objects.select_related("customer").order_by("-reading_month")
    return render(request, "core/meter_reading_list.html", {"readings": readings})


def invoice_list(request):
    invoices = Invoice.objects.select_related("customer").order_by("-issue_date")
    return render(request, "core/invoice_list.html", {"invoices": invoices})


def payment_status_list(request):
    invoices = Invoice.objects.select_related("customer").order_by("status", "due_date")
    return render(request, "core/payment_status_list.html", {"invoices": invoices})
