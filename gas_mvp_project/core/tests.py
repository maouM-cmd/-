from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Contract, Customer, Invoice, MeterReading, Payment
from .services import calculate_invoice_amounts, create_invoice_for_meter_reading, get_latest_meter_value


class BaseDataMixin(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="staff", password="pass")
        self.customer = Customer.objects.create(
            customer_code="C0001",
            name="テスト太郎",
            address1="東京都千代田区1-1",
            billing_method="bank_transfer",
        )
        self.contract = Contract.objects.create(
            customer=self.customer,
            plan_name="標準",
            base_fee=Decimal("1500.00"),
            unit_price=Decimal("450.00"),
            tax_rate=Decimal("10.00"),
            tax_rounding_rule="floor",
            start_date=date(2025, 1, 1),
        )


class MeterReadingModelTests(BaseDataMixin):
    def test_usage_amount_is_auto_calculated(self):
        reading = MeterReading.objects.create(
            customer=self.customer,
            reading_month=date(2025, 2, 1),
            current_value=128,
            previous_value=100,
            usage_amount=0,
            measured_at=date(2025, 2, 20),
            input_user=self.user,
        )
        self.assertEqual(reading.usage_amount, 28)

    def test_latest_meter_value(self):
        MeterReading.objects.create(
            customer=self.customer,
            reading_month=date(2025, 1, 1),
            current_value=110,
            previous_value=100,
            usage_amount=0,
            measured_at=date(2025, 1, 20),
            input_user=self.user,
        )
        MeterReading.objects.create(
            customer=self.customer,
            reading_month=date(2025, 2, 1),
            current_value=125,
            previous_value=110,
            usage_amount=0,
            measured_at=date(2025, 2, 20),
            input_user=self.user,
        )
        self.assertEqual(get_latest_meter_value(self.customer), 125)


class InvoiceAndPaymentTests(BaseDataMixin):
    def test_calculate_invoice_amounts(self):
        amounts = calculate_invoice_amounts(self.contract, 10)
        self.assertEqual(amounts["usage_fee_amount"], Decimal("4500.00"))
        self.assertEqual(amounts["subtotal_amount"], Decimal("6000.00"))
        self.assertEqual(amounts["tax_amount"], Decimal("600"))
        self.assertEqual(amounts["total_amount"], Decimal("6600.00"))

    def test_invoice_generation_and_payment_status(self):
        reading = MeterReading.objects.create(
            customer=self.customer,
            reading_month=date(2025, 2, 1),
            current_value=120,
            previous_value=100,
            usage_amount=0,
            measured_at=date(2025, 2, 20),
            input_user=self.user,
        )
        invoice = create_invoice_for_meter_reading(
            reading,
            issue_date=date(2025, 2, 25),
            due_date=date(2025, 3, 10),
        )
        self.assertTrue(invoice.invoice_no.startswith("INV-202502-C0001"))
        self.assertEqual(invoice.status, "issued")

        Payment.objects.create(
            invoice=invoice,
            payment_date=date(2025, 3, 1),
            payment_amount=Decimal("2000"),
            payment_method="bank_transfer",
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, "partial")

        Payment.objects.create(
            invoice=invoice,
            payment_date=date(2025, 3, 2),
            payment_amount=invoice.remaining_amount,
            payment_method="bank_transfer",
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, "paid")


class ViewFlowTests(BaseDataMixin):
    def test_basic_pages(self):
        for name in [
            "core:dashboard",
            "core:customer_list",
            "core:meter_reading_list",
            "core:invoice_list",
            "core:payment_status_list",
        ]:
            response = self.client.get(reverse(name))
            self.assertEqual(response.status_code, 200)

    def test_meter_reading_create_post(self):
        self.client.force_login(self.user)
        response = self.client.post(
            reverse("core:meter_reading_create"),
            {
                "customer": self.customer.id,
                "reading_month": "2025-02-01",
                "measured_at": "2025-02-20",
                "previous_value": 100,
                "current_value": 130,
                "note": "test",
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MeterReading.objects.count(), 1)

    def test_payment_create_post(self):
        reading = MeterReading.objects.create(
            customer=self.customer,
            reading_month=date(2025, 2, 1),
            current_value=120,
            previous_value=100,
            usage_amount=0,
            measured_at=date(2025, 2, 20),
            input_user=self.user,
        )
        invoice = Invoice.objects.create(
            invoice_no="INV-TEST-1",
            customer=self.customer,
            meter_reading=reading,
            issue_date=date(2025, 2, 25),
            due_date=date(2025, 3, 10),
            base_fee_amount=Decimal("1500.00"),
            usage_fee_amount=Decimal("9000.00"),
            subtotal_amount=Decimal("10500.00"),
            tax_amount=Decimal("1050.00"),
            total_amount=Decimal("11550.00"),
            tax_rate=Decimal("10.00"),
        )
        response = self.client.post(
            reverse("core:payment_create", kwargs={"invoice_id": invoice.id}),
            {
                "payment_date": "2025-03-01",
                "payment_amount": "5000",
                "payment_method": "cash",
                "received_by": "担当A",
                "reference_no": "",
                "note": "",
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, "partial")
