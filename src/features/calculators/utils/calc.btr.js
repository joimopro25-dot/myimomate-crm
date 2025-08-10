// features/calculators/utils/calc.btr.js
export function computeBTR(i){
  const price=+i.price||0, rent=+i.rent||0;
  const costs=(+i.costsPct||0)/100*price;
  const grossYield = price? (rent*12/price*100):0;
  const fixed=(+i.imi||0)+(+i.insure||0);
  const maint=(+i.maintPct||0)/100*rent*12;
  const vacancy=(+i.vacancyPct||0)/100*rent*12;
  const netIncome=rent*12 - fixed - maint - vacancy;
  const netYield = price? (netIncome/price*100):0;
  const equity = price - ((+i.ltv||0)/100*price);
  const coc = equity? (netIncome/equity*100):0;
  return { grossYield, netYield, coc, costs };
}
