const STEPS = [
  { icon: 'bi-upc-scan', title: 'Введите артикул', text: 'Номер детали из каталога, с упаковки или из заказа.' },
  { icon: 'bi-buildings', title: 'Выберите производителя', text: 'Один и тот же артикул бывает у разных брендов.' },
  { icon: 'bi-tags', title: 'Сравните предложения', text: 'Цены, остатки на складах и аналоги.' },
];

export default function Welcome() {
  return (
    <ol className="steps">
      {STEPS.map((step, index) => (
        <li key={step.title} className="steps__item">
          <span className="steps__icon" aria-hidden="true">
            <i className={`bi ${step.icon}`} />
          </span>
          <div>
            <div className="steps__title">
              <span className="steps__number">{index + 1}</span>
              {step.title}
            </div>
            <div className="steps__text">{step.text}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
