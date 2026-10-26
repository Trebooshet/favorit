import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDebounce } from '../hooks/useDebounce';
import { queryChanged, searchBrands } from '../store/searchSlice';

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 500;

export default function SearchForm() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const query = useDebounce(value.trim(), DEBOUNCE_MS);

  useEffect(() => {
    dispatch(queryChanged(query));
    if (query.length < MIN_QUERY_LENGTH) return undefined;

    const request = dispatch(searchBrands(query));
    return () => request.abort();
  }, [query, dispatch]);

  const clear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="part-number" className="search__label">
        Артикул детали
      </label>
      <div className="search__field">
        <i className="bi bi-search search__icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id="part-number"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          className="form-control form-control-lg search__input"
          placeholder="Например, 7160500039S"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && clear()}
        />
        {value && (
          <button type="button" className="search__clear" aria-label="Очистить поиск" onClick={clear}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="form-text">Поиск начнётся от {MIN_QUERY_LENGTH} символов.</div>
    </form>
  );
}
