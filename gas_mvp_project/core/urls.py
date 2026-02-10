from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("customers/", views.customer_list, name="customer_list"),
    path("meter-readings/", views.meter_reading_list, name="meter_reading_list"),
    path("meter-readings/new/", views.meter_reading_create, name="meter_reading_create"),
    path("meter-readings/<int:meter_reading_id>/generate-invoice/", views.invoice_generate, name="invoice_generate"),
    path("invoices/", views.invoice_list, name="invoice_list"),
    path("payments/", views.payment_status_list, name="payment_status_list"),
    path("payments/new/<int:invoice_id>/", views.payment_create, name="payment_create"),
]
