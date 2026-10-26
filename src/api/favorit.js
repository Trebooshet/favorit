const API_URL = 'http://api.favorit-parts.ru/hs/hsprice/';
const API_KEY = import.meta.env.VITE_API_KEY;

const API_ERRORS = {
  'Empty key!': 'Не указан ключ покупателя.',
  'Invalid key client!': 'Неверный ключ покупателя: покупатель не найден.',
  'Invalid access key': 'Неверный ключ покупателя: покупатель не найден.',
  'Empty number goods!': 'Не указан номер детали.',
  'Request quota exceeded!':
    'Превышен лимит запросов по грузовому ассортименту. Попробуйте позже или поищите другую деталь.',
};

export function translateApiError(error) {
  const text = String(error).trim();
  if (API_ERRORS[text]) return API_ERRORS[text];
  const known = Object.keys(API_ERRORS).filter((key) => text.includes(key));
  return known.length ? known.map((key) => API_ERRORS[key]).join(' ') : `Ошибка сервиса: ${text}`;
}

export async function fetchGoods({ number, brand, analogues = false }, { signal } = {}) {
  const params = new URLSearchParams({ key: API_KEY, number });
  if (brand) params.set('brand', brand);
  if (analogues) params.set('analogues', 'on');

  let response;
  try {
    response = await fetch(`${API_URL}?${params}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к интернету.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Сервер вернул некорректный ответ (код ${response.status}).`);
  }

  if (data.error) throw new Error(translateApiError(data.error));
  if (!response.ok) throw new Error(`Ошибка сервера (код ${response.status}).`);

  return Array.isArray(data.goods) ? data.goods : [];
}
