// shared/utils/date.js
export function startOfMonth(date=new Date()){
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
}
export function endOfMonth(date=new Date()){
  return new Date(date.getFullYear(), date.getMonth()+1, 0, 23,59,59,999).getTime();
}
export function toDateInputValue(ts){
  const d = new Date(ts || Date.now());
  const pad = (n)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}