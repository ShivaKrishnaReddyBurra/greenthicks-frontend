
/**
 * Formats a number as Indian Rupees
 * @param amount The amount to format
 * @returns A formatted string with ₹ symbol
 */
export function formatPrice(amount: number): string {
  // Format to Indian numbering system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
}
