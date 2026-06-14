import i18next from "i18next";

/**
 * Formats an amount to Egyptian Pound (EGP) format.
 * Supports localization based on the current language.
 */
export const formatCurrency = (amount: number): string => {
  const language = i18next.language || 'ar';
  
  if (language === 'ar') {
    return `${amount.toLocaleString('ar-EG')} ج.م`;
  }
  
  return `${amount.toLocaleString('en-EG')} EGP`;
};
