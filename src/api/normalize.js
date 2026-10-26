const isEmptyItem = (item) => !item || !item.brand || !item.number;

export function toBrands(goods) {
  return goods
    .filter((item) => !isEmptyItem(item))
    .map((item) => ({
      id: item.goodsID,
      brand: item.brand,
      number: item.number,
      name: item.name,
      count: item.count,
    }))
    .sort((a, b) => (b.count > 0) - (a.count > 0));
}

export function toOffers(goods) {
  const offers = [];

  goods.forEach((item) => {
    if (isEmptyItem(item)) return;
    offers.push(toOffer(item, true));
    (item.analogues || []).forEach((analogue) => {
      if (!isEmptyItem(analogue)) offers.push(toOffer(analogue, false));
    });
  });

  return offers;
}

function toOffer(item, isOriginal) {
  const warehouses = (item.warehouses || [])
    .filter((w) => w.stock > 0)
    .map((w, index) => ({
      key: `${w.id}-${index}`,
      code: w.code || 'Склад поставщика',
      own: Boolean(w.own),
      price: w.price,
      stock: w.stock,
      shipmentDate: w.shipmentDate,
    }))
    .sort((a, b) => a.price - b.price);

  return {
    id: `${item.goodsID}-${isOriginal ? 'o' : 'a'}`,
    brand: item.brand,
    number: item.number,
    name: item.name,
    isOriginal,
    stock: warehouses.reduce((sum, w) => sum + w.stock, 0),
    minPrice: warehouses.length ? warehouses[0].price : null,
    warehouses,
  };
}
