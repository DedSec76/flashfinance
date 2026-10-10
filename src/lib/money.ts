export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function toMoneyNumber(value: unknown): number {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string" || (
          typeof value === "object" &&
          value !== null &&
          "toString" in value &&
          typeof value.toString === "function"
        )
        ? Number(value.toString())
        : Number.NaN;

  if (!Number.isFinite(amount)) {
    throw new Error("Invalid monetary amount.");
  }

  return roundMoney(amount);
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(roundMoney(amount));
}

export function currentMonthValue(now = new Date()) {
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${now.getUTCFullYear()}-${month}`;
}

export function formatMonthLabel(month: string) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthIndex = Number(monthText);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex - 1, 1)));
}
