from django import forms
from django.utils import timezone

from .models import MeterReading, Payment


class MeterReadingCreateForm(forms.ModelForm):
    class Meta:
        model = MeterReading
        fields = ["customer", "reading_month", "measured_at", "previous_value", "current_value", "note"]
        widgets = {
            "reading_month": forms.DateInput(attrs={"type": "date"}),
            "measured_at": forms.DateInput(attrs={"type": "date"}),
            "note": forms.Textarea(attrs={"rows": 2}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        today = timezone.localdate()
        self.fields["reading_month"].initial = today.replace(day=1)
        self.fields["measured_at"].initial = today


class PaymentCreateForm(forms.ModelForm):
    class Meta:
        model = Payment
        fields = ["payment_date", "payment_amount", "payment_method", "received_by", "reference_no", "note"]
        widgets = {
            "payment_date": forms.DateInput(attrs={"type": "date"}),
            "note": forms.Textarea(attrs={"rows": 2}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["payment_date"].initial = timezone.localdate()
