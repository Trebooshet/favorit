import { useDispatch, useSelector } from 'react-redux';
import { brandSelected, searchBrands } from '../store/searchSlice';
import { breakable } from '../utils/format';
import { BrandsSkeleton, EmptyState, ErrorMessage } from './StatusViews';
import Welcome from './Welcome';

export default function BrandList() {
  const dispatch = useDispatch();
  const { query, brands } = useSelector((state) => state.search);

  if (brands.status === 'idle') return <Welcome />;
  if (brands.status === 'loading') return <BrandsSkeleton />;
  if (brands.status === 'failed') {
    return <ErrorMessage message={brands.error} onRetry={() => dispatch(searchBrands(query))} />;
  }
  if (!brands.items.length) {
    return (
      <EmptyState
        icon="bi-search"
        title={`По артикулу «${query}» ничего не найдено`}
        text="Проверьте номер детали: без пробелов, с теми же буквами и цифрами, что в каталоге."
      />
    );
  }

  const inStock = brands.items.filter((item) => item.count > 0);
  const outOfStock = brands.items.filter((item) => item.count === 0);
  const select = (item) => dispatch(brandSelected(item));

  return (
    <section>
      <h2 className="section-title">
        Выберите производителя <span className="count-badge">{brands.items.length}</span>
      </h2>
      <BrandGroup title="В наличии" items={inStock} onSelect={select} />
      <BrandGroup title="Нет в наличии" items={outOfStock} onSelect={select} />
    </section>
  );
}

function BrandGroup({ title, items, onSelect }) {
  if (!items.length) return null;

  return (
    <div className="brand-group">
      <h3 className="brand-group__title">
        {title} <span className="count-badge">{items.length}</span>
      </h3>
      <div className="brand-grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`brand-card ${item.count > 0 ? '' : 'brand-card--muted'}`}
            onClick={() => onSelect(item)}
          >
            <span className="brand-card__head">
              <span className="brand-card__brand">{item.brand}</span>
              <i className="bi bi-arrow-right brand-card__arrow" aria-hidden="true" />
            </span>
            <span className="brand-card__number">{item.number}</span>
            <span className="brand-card__name">{breakable(item.name)}</span>
            {item.count > 0 ? (
              <span className="brand-card__stock">
                <i className="bi bi-box-seam" aria-hidden="true" /> {item.count} шт. на складах
              </span>
            ) : (
              <span className="brand-card__stock brand-card__stock--none">Посмотреть аналоги</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
