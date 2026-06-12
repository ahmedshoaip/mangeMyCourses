import i18n from '../i18n';

export const formatCurrency = (amount: number) => {
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const currency = i18n.language === 'ar' ? 'EGP' : 'USD';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
