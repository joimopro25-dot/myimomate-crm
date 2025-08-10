// features/calculators/utils/calc.fixflip.js
export function computeFixFlip(i){
  const buy=+i.buy||0, rehab=+i.rehab||0, sell=+i.sell||0;
  const buyCosts=(+i.buyCostsPct||0)/100*buy;
  const sellCosts=(+i.sellCostsPct||0)/100*sell;
  const totalCost=buy+rehab+buyCosts;
  const profit=sell - sellCosts - totalCost;
  const roiPct = totalCost? (profit/totalCost*100):0;
  const months=+i.months||1; const roiAnnPct = roiPct*(12/months);
  return { profit, roiPct, roiAnnPct };
}