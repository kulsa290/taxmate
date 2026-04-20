export function calculateNewTax(income) {
  let tax = 0;

  const slabs = [
    [300000, 0],
    [600000, 0.05],
    [900000, 0.10],
    [1200000, 0.15],
    [1500000, 0.20],
    [Infinity, 0.30],
  ];

  let prevLimit = 0;

  for (const [limit, rate] of slabs) {
    if (income > prevLimit) {
      const taxable = Math.min(income, limit) - prevLimit;
      tax += taxable * rate;
      prevLimit = limit;
    }
  }

  return tax;
}
