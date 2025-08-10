// features/calculators/utils/calc.offplan.js
export function computeOffPlan(i){
  const deposit=+i.deposit||0, inst=+i.installments||0, finalPrice=+i.finalPrice||0, expected=+i.expectedPrice||0;
  const totalCash = deposit + inst;
  const profit = Math.max(expected - finalPrice, 0);
  const roiPct = totalCash? (profit/totalCash*100):0;
  return { totalCash, profit, roiPct };
}