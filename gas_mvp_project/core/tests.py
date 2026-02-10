from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Contract, Customer, MeterReading


class MeterReadingModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="staff", password="pass")
        self.customer = Customer.objects.create(
            customer_code="C0001",
            name="テスト太郎",
            address1="東京都千代田区1-1",
            billing_method="bank_transfer",
        )
        Contract.objects.create(
            customer=self.customer,
            plan_name="標準",
            base_fee=Decimal("1500.00"),
            unit_price=Decimal("450.00"),
            tax_rate=Decimal("10.00"),
            tax_rounding_rule="floor",
            start_date=date(2025, 1, 1),
        )

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


class BasicPageTests(TestCase):
    def test_dashboard_page(self):
        response = self.client.get(reverse("core:dashboard"))
        self.assertEqual(response.status_code, 200)

    def test_customer_list_page(self):
        response = self.client.get(reverse("core:customer_list"))
        self.assertEqual(response.status_code, 200)
