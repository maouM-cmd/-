from django.contrib import admin

from .models import Contract, Customer, Invoice, MeterReading, Payment, ReceiptIssue


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("customer_code", "name", "phone", "billing_method", "is_active")
    search_fields = ("customer_code", "name", "name_kana", "phone")
    list_filter = ("is_active", "billing_method")


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("customer", "plan_name", "base_fee", "unit_price", "tax_rate", "start_date", "end_date")
    search_fields = ("customer__name", "plan_name")
    list_filter = ("tax_rounding_rule",)


@admin.register(MeterReading)
class MeterReadingAdmin(admin.ModelAdmin):
    list_display = ("customer", "reading_month", "previous_value", "current_value", "usage_amount", "measured_at")
    search_fields = ("customer__name", "customer__customer_code")
    list_filter = ("reading_month",)


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_no", "customer", "issue_date", "due_date", "total_amount", "status")
    search_fields = ("invoice_no", "customer__name", "customer__customer_code")
    list_filter = ("status", "issue_date")
    inlines = [PaymentInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("invoice", "payment_date", "payment_amount", "payment_method", "received_by")
    list_filter = ("payment_method", "payment_date")
    search_fields = ("invoice__invoice_no", "invoice__customer__name")


@admin.register(ReceiptIssue)
class ReceiptIssueAdmin(admin.ModelAdmin):
    list_display = ("receipt_no", "payment", "issued_at")
    search_fields = ("receipt_no", "payment__invoice__invoice_no")
