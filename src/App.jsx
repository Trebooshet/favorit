import { useSelector } from 'react-redux';
import BrandList from './components/BrandList';
import Offers from './components/Offers';
import SearchForm from './components/SearchForm';

export default function App() {
  const selectedBrand = useSelector((state) => state.search.selectedBrand);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container app-header__inner">
          <span className="app-logo">
            <i className="bi bi-gear-wide-connected app-logo__icon" aria-hidden="true" />
            Фаворит
          </span>
          <span className="app-subtitle">Поиск автозапчастей</span>
        </div>
      </header>

      <main className="container app-main">
        <div className="search-card">
          <SearchForm />
        </div>

        {selectedBrand ? <Offers /> : <BrandList />}
      </main>
    </div>
  );
}
