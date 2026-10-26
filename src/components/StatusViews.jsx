export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-card status-card--error" role="alert">
      <i className="bi bi-exclamation-triangle status-card__icon" aria-hidden="true" />
      <div className="status-card__body">
        <div className="status-card__title">Не получилось загрузить данные</div>
        <div className="status-card__text">{message}</div>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
          Повторить
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = 'bi-search', title, text }) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon} empty-state__icon`} aria-hidden="true" />
      <div className="empty-state__title">{title}</div>
      {text && <div className="empty-state__text">{text}</div>}
    </div>
  );
}

export function BrandsSkeleton() {
  return (
    <div role="status">
      <span className="visually-hidden">Ищем производителей…</span>
      <div className="skeleton skeleton--title" />
      <div className="brand-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="brand-card brand-card--skeleton">
            <div className="skeleton skeleton--line w-50" />
            <div className="skeleton skeleton--line w-25" />
            <div className="skeleton skeleton--line w-75" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="offers-table" role="status">
      <span className="visually-hidden">Загружаем предложения и аналоги…</span>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="offers-row" aria-hidden="true">
          <div className="skeleton skeleton--line w-75" />
          <div className="skeleton skeleton--line w-50" />
          <div className="skeleton skeleton--line ms-auto w-75" />
          <div className="skeleton skeleton--line ms-auto w-50" />
          <div />
        </div>
      ))}
    </div>
  );
}
