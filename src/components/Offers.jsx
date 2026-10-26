import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { brandCleared, searchOffers } from '../store/searchSlice';
import { breakable, formatPrice, formatShipment } from '../utils/format';
import { EmptyState, ErrorMessage, TableSkeleton } from './StatusViews';

const PAGE_SIZE = 30;

export default function Offers() {
  const dispatch = useDispatch();
  const { selectedBrand, offers } = useSelector((state) => state.search);
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sectionRef = useRef(null);

  const load = useCallback(
    () => dispatch(searchOffers({ number: selectedBrand.number, brand: selectedBrand.brand })),
    [dispatch, selectedBrand],
  );

  useEffect(() => {
    const request = load();
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < 0) section.scrollIntoView?.({ behavior: 'smooth' });
    return () => request.abort();
  }, [load]);

  const items = useMemo(() => {
    const list = onlyInStock ? offers.items.filter((o) => o.stock > 0) : offers.items;
    return [...list].sort(
      (a, b) =>
        b.isOriginal - a.isOriginal || (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity),
    );
  }, [offers.items, onlyInStock]);

  useEffect(() => setVisible(PAGE_SIZE), [items]);

  const analoguesCount = items.filter((o) => !o.isOriginal).length;

  return (
    <section ref={sectionRef} className="offers">
      <div className="offers-header">
        <button
          type="button"
          className="btn btn-link p-0 offers-header__back back-button"
          aria-label="К списку производителей"
          onClick={() => dispatch(brandCleared())}
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          <span className="back-button__text">
            К списку<span className="back-button__more"> производителей</span>
          </span>
        </button>
        <div className="offers-header__title">
          <h2 className="offers-header__brand">
            {selectedBrand.brand} <span className="offers-header__number">{selectedBrand.number}</span>
          </h2>
          <div className="offers-header__name">{breakable(selectedBrand.name)}</div>
        </div>
        {offers.status === 'succeeded' && (
          <div className="offers-header__meta">
            <div className="offers-header__count">
              Найдено позиций:{' '}
              <span className="text-nowrap">
                {items.length}
                {onlyInStock && offers.items.length !== items.length && ` из ${offers.items.length}`}
              </span>
            </div>
            <div className="form-check form-switch offers-stock-switch">
              <input
                id="only-in-stock"
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="only-in-stock">
                Только в наличии
              </label>
            </div>
          </div>
        )}
      </div>

      {offers.status === 'loading' && <TableSkeleton />}
      {offers.status === 'failed' && <ErrorMessage message={offers.error} onRetry={load} />}

      {offers.status === 'succeeded' && (
        <>
          <OffersTable items={items.slice(0, visible)} analoguesCount={analoguesCount} onlyInStock={onlyInStock} />
          {visible < items.length && (
            <div className="offers-more">
              <button type="button" className="btn btn-outline-primary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Показать ещё {Math.min(PAGE_SIZE, items.length - visible)}
              </button>
              <div className="offers-more__text">
                Показано {visible} из {items.length}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function OffersTable({ items, analoguesCount, onlyInStock }) {
  const originalsCount = items.filter((o) => o.isOriginal).length;
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded((current) => (current === id ? null : id));

  return (
    <div className="offers-table">
      <div className="offers-row offers-row--head" aria-hidden="true">
        <span>Название запчасти</span>
        <span>Производитель</span>
        <span className="text-end">Цена</span>
        <span className="text-end">Остаток</span>
        <span />
      </div>

      {items.length === 0 && (
        <EmptyState
          icon="bi-box"
          title="Нет предложений"
          text={onlyInStock ? 'Выключите «Только в наличии», чтобы увидеть позиции без остатка.' : 'По этой детали нет данных.'}
        />
      )}

      {items.map((offer, index) => {
        const isOpen = expanded === offer.id;
        const hasWarehouses = offer.warehouses.length > 0;
        const isFirstAnalogue = !offer.isOriginal && (index === 0 || items[index - 1].isOriginal);
        const isStriped = !offer.isOriginal && (index - originalsCount) % 2 === 1;
        return (
          <Fragment key={offer.id}>
            {isFirstAnalogue && (
              <div className="offers-divider">
                Аналоги <span className="count-badge">{analoguesCount}</span>
              </div>
            )}
            <div
              className={`offers-row ${offer.isOriginal ? 'offers-row--original' : ''} ${isStriped ? 'offers-row--striped' : ''} ${isOpen ? 'is-open' : ''}`}
            >
              <div className="offers-cell-name">
                <span className="fw-semibold">{breakable(offer.name)}</span>
                {offer.isOriginal && <span className="badge text-bg-primary">Искомая деталь</span>}
              </div>
              <div className="offers-cell-brand">
                <span className="offers-label">Производитель</span>
                <div className="fw-semibold">{offer.brand}</div>
                <div className="text-secondary small">{offer.number}</div>
              </div>
              <div className="offers-cell-price">
                <span className="offers-label">Цена</span>
                {offer.minPrice != null && offer.warehouses.length > 1 && <span className="small">от </span>}
                <span className={offer.minPrice != null ? 'price-value' : 'text-secondary'}>{formatPrice(offer.minPrice)}</span>
              </div>
              <div className="offers-cell-stock">
                <span className="offers-label">Остаток</span>
                {offer.stock > 0 ? (
                  <span className="stock-value">{offer.stock} шт.</span>
                ) : (
                  <span className="text-secondary">нет</span>
                )}
              </div>
              <div className="offers-cell-action">
                {hasWarehouses && (
                  <button
                    type="button"
                    className="btn btn-sm warehouses-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggle(offer.id)}
                  >
                    {isOpen ? (
                      <>
                        Скрыть
                        <i className="bi bi-chevron-up warehouses-toggle__icon" aria-hidden="true" />
                      </>
                    ) : (
                      `Склады · ${offer.warehouses.length}`
                    )}
                  </button>
                )}
              </div>
            </div>

            {isOpen && <WarehouseList warehouses={offer.warehouses} />}
          </Fragment>
        );
      })}
    </div>
  );
}

function WarehouseList({ warehouses }) {
  return (
    <ul className="warehouse-list">
      {warehouses.map((w) => (
        <li key={w.key} className="warehouse-item">
          <div className="warehouse-item__name">
            <div>
              {w.code}
              {w.own && <span className="badge text-bg-success ms-2">Наш склад</span>}
            </div>
            <div className="warehouse-item__date">
              <i className="bi bi-truck" aria-hidden="true" /> {formatShipment(w.shipmentDate)}
            </div>
          </div>
          <span className="warehouse-item__price text-end price-value">{formatPrice(w.price)}</span>
          <span className="warehouse-item__stock text-end stock-value">{w.stock} шт.</span>
        </li>
      ))}
    </ul>
  );
}
