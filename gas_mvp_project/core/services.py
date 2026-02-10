from decimal import Decimal, ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP

from .models import Contract, Customer, Invoice, MeterReading


def get_latest_meter_value(customer: Customer) -> int:
    latest = customer.meter_readings.order_by("-reading_month", "-measured_at").first()
    if not latest:
        return 0
    return latest.current_value


def _round_tax(value: Decimal, rule: str) -> Decimal:
    if rule == "ceil":
        return value.quantize(Decimal("1"), rounding=ROUND_CEILING)
    if rule == "round":
        return value.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    return value.quantize(Decimal("1"), rounding=ROUND_FLOOR)


def calculate_invoice_amounts(contract: Contract, usage_amount: int) -> dict[str, Decimal]:
    usage_fee = Decimal(usage_amount) * contract.unit_price
    base_fee = contract.base_fee
    subtotal = base_fee + usage_fee
    tax_raw = subtotal * (contract.tax_rate / Decimal("100"))
    tax = _round_tax(tax_raw, contract.tax_rounding_rule)
    total = subtotal + tax

    return {
        "base_fee_amount": base_fee,
        "usage_fee_amount": usage_fee,
        "subtotal_amount": subtotal,
        "tax_amount": tax,
        "total_amount": total,
        "tax_rate": contract.tax_rate,
    }


def create_invoice_for_meter_reading(
    meter_reading: MeterReading,
    *,
    issue_date,
    due_date,
) -> Invoice:
    contract = meter_reading.customer.contracts.filter(start_date__lte=meter_reading.measured_at).order_by("-start_date").first()
    if contract is None:
        raise ValueError("有効な契約が見つかりません。")

    amounts = calculate_invoice_amounts(contract, meter_reading.usage_amount)
    invoice_no = f"INV-{meter_reading.reading_month:%Y%m}-{meter_reading.customer.customer_code}"

    invoice = Invoice.objects.create(
        invoice_no=invoice_no,
        customer=meter_reading.customer,
        meter_reading=meter_reading,
        issue_date=issue_date,
        due_date=due_date,
        **amounts,
    )
    return invoice
