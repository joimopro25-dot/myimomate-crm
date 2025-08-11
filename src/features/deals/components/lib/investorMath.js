// src/features/deals/lib/investorMath.js
const n = (v) => (v === "" || v == null ? 0 : Number(v));

export function computeInvestorMetrics(d) {
  const purchase = n(d.propertyPrice);
  const monthlyRent = n(d.monthlyRent);
  const annualRent = monthlyRent * 12;
  const vacancy = annualRent * (n(d.vacancyRate) / 100);
  const netRent = annualRent - vacancy;

  const expenses =
    n(d.propertyTax) + n(d.insurance) + n(d.condoFees) + n(d.utilities) +
    n(d.maintenance) + n(d.management);

  const noi = netRent - expenses;

  // loan
  const loan = n(d.bankLoan);
  const rate = n(d.interestRate) / 100;
  const years = n(d.loanTerm);
  let annualLoanPayments = 0;
  if (loan > 0 && rate > 0 && years > 0) {
    const mr = rate / 12;
    const nPay = years * 12;
    const mp = loan * (mr * Math.pow(1 + mr, nPay)) / (Math.pow(1 + mr, nPay) - 1);
    annualLoanPayments = mp * 12;
  }

  const cashflow = noi - annualLoanPayments;

  // break-even
  const totalMonthlyCosts = (expenses + annualLoanPayments) / 12;
  const vacRate = n(d.vacancyRate) / 100;
  const breakEvenRent = vacRate < 1 ? totalMonthlyCosts / (1 - vacRate) : totalMonthlyCosts;
  const rentCushion = monthlyRent - breakEvenRent;

  // ratios
  const capRate = purchase > 0 ? (noi / purchase) * 100 : 0;
  const ownCapital = n(d.ownCapital);
  const roi = ownCapital > 0 ? (cashflow / ownCapital) * 100 : 0;

  // score simples (ajusta como quiseres)
  const score = Math.max(0, Math.min(100, Math.round((capRate * 0.6) + (roi * 0.4))));

  return { noi, cashflow, breakEvenRent, rentCushion, capRate, roi, score };
}
