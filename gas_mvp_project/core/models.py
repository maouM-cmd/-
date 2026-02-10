from django.conf import settings
from django.db import models


class BaseTimestampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Customer(BaseTimestampModel):
    BILLING_METHOD_CHOICES = [
        ("cash", "現金"),
        ("bank_transfer", "振込"),
        ("account_transfer", "口座振替"),
    ]

    customer_code = models.CharField("顧客番号", max_length=30, unique=True)
    name = models.CharField("氏名", max_length=120)
    name_kana = models.CharField("氏名（カナ）", max_length=120, blank=True)
    postal_code = models.CharField("郵便番号", max_length=8, blank=True)
    address1 = models.CharField("住所1", max_length=255)
    address2 = models.CharField("住所2", max_length=255, blank=True)
    phone = models.CharField("電話番号", max_length=20, blank=True)
    billing_method = models.CharField("支払方法", max_length=20, choices=BILLING_METHOD_CHOICES, default="bank_transfer")
    is_active = models.BooleanField("有効", default=True)

    def __str__(self) -> str:
        return f"{self.customer_code} - {self.name}"


class Contract(BaseTimestampModel):
    ROUNDING_RULE_CHOICES = [
        ("round", "四捨五入"),
        ("floor", "切り捨て"),
        ("ceil", "切り上げ"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="contracts", verbose_name="顧客")
    plan_name = models.CharField("プラン名", max_length=100)
    base_fee = models.DecimalField("基本料金", max_digits=10, decimal_places=2)
    unit_price = models.DecimalField("従量単価", max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField("税率", max_digits=4, decimal_places=2, default=10.00)
    tax_rounding_rule = models.CharField("端数処理", max_length=10, choices=ROUNDING_RULE_CHOICES, default="floor")
    invoice_registration_no = models.CharField("適格請求書登録番号", max_length=30, blank=True)
    start_date = models.DateField("契約開始日")
    end_date = models.DateField("契約終了日", null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.customer.name} / {self.plan_name}"


class MeterReading(BaseTimestampModel):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="meter_readings", verbose_name="顧客")
    reading_month = models.DateField("検針月")
    current_value = models.PositiveIntegerField("今月指針")
    previous_value = models.PositiveIntegerField("前回指針")
    usage_amount = models.PositiveIntegerField("使用量")
    measured_at = models.DateField("検針日")
    input_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="input_meter_readings",
        verbose_name="入力担当",
    )
    note = models.TextField("備考", blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["customer", "reading_month"], name="uq_customer_reading_month")
        ]
        ordering = ["-reading_month", "customer__customer_code"]

    def save(self, *args, **kwargs):
        self.usage_amount = self.current_value - self.previous_value
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.customer.name} / {self.reading_month:%Y-%m}"


class Invoice(BaseTimestampModel):
    STATUS_CHOICES = [
        ("issued", "発行済"),
        ("paid", "入金済"),
        ("overdue", "期限超過"),
        ("cancelled", "取消"),
    ]

    invoice_no = models.CharField("請求番号", max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="invoices", verbose_name="顧客")
    meter_reading = models.OneToOneField(MeterReading, on_delete=models.PROTECT, related_name="invoice", verbose_name="検針")
    issue_date = models.DateField("発行日")
    due_date = models.DateField("支払期限")
    base_fee_amount = models.DecimalField("基本料金", max_digits=10, decimal_places=2)
    usage_fee_amount = models.DecimalField("従量料金", max_digits=10, decimal_places=2)
    subtotal_amount = models.DecimalField("税抜合計", max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField("消費税", max_digits=10, decimal_places=2)
    total_amount = models.DecimalField("税込合計", max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField("税率", max_digits=4, decimal_places=2, default=10.00)
    status = models.CharField("ステータス", max_length=20, choices=STATUS_CHOICES, default="issued")
    pdf_path = models.CharField("PDFパス", max_length=255, blank=True)

    class Meta:
        ordering = ["-issue_date", "invoice_no"]

    def __str__(self) -> str:
        return self.invoice_no


class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name="payments", verbose_name="請求")
    payment_date = models.DateField("入金日")
    payment_amount = models.DecimalField("入金額", max_digits=10, decimal_places=2)
    payment_method = models.CharField("入金方法", max_length=30)
    received_by = models.CharField("受領担当", max_length=120, blank=True)
    reference_no = models.CharField("参照番号", max_length=100, blank=True)
    note = models.TextField("備考", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date", "-created_at"]

    def __str__(self) -> str:
        return f"{self.invoice.invoice_no} / {self.payment_amount}"


class ReceiptIssue(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT, related_name="receipt_issues", verbose_name="入金")
    receipt_no = models.CharField("領収書番号", max_length=50)
    issued_at = models.DateTimeField("発行日時")
    pdf_path = models.CharField("PDFパス", max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-issued_at"]

    def __str__(self) -> str:
        return self.receipt_no
