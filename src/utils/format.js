const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

export const breakable = (text) => String(text ?? '').replace(/([,/])(?=\S)/g, '$1\u200b');

export const formatPrice = (value) => (value == null ? '—' : priceFormat.format(value));

export function formatShipment(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '—';
  return `Доставим ${dateFormat.format(date)}, заказ до ${timeFormat.format(date)}`;
}
