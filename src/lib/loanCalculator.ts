export const calculateLoan = (principal: number, rate: number, term: number) => {
  const interest = principal * (rate / 100);
  const total = principal + interest;
  const monthly = total / term;
  return { interest, total, monthly };
}