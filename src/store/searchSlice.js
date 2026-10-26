import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchGoods } from '../api/favorit';
import { toBrands, toOffers } from '../api/normalize';

export const searchBrands = createAsyncThunk('search/brands', async (number, { signal }) => {
  const goods = await fetchGoods({ number }, { signal });
  return toBrands(goods);
});

export const searchOffers = createAsyncThunk('search/offers', async ({ number, brand }, { signal }) => {
  const goods = await fetchGoods({ number, brand, analogues: true }, { signal });
  return toOffers(goods);
});

const request = () => ({ status: 'idle', items: [], error: null });

const initialState = {
  query: '',
  selectedBrand: null,
  brands: request(),
  offers: request(),
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    queryChanged(state, action) {
      state.query = action.payload;
      state.selectedBrand = null;
      state.brands = request();
      state.offers = request();
    },
    brandSelected(state, action) {
      state.selectedBrand = action.payload;
    },
    brandCleared(state) {
      state.selectedBrand = null;
      state.offers = request();
    },
  },
  extraReducers: (builder) => {
    [
      [searchBrands, 'brands'],
      [searchOffers, 'offers'],
    ].forEach(([thunk, field]) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[field] = { status: 'loading', items: [], error: null };
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state[field] = { status: 'succeeded', items: action.payload, error: null };
        })
        .addCase(thunk.rejected, (state, action) => {
          if (action.meta.aborted) return;
          state[field] = { status: 'failed', items: [], error: action.error.message };
        });
    });
  },
});

export const { queryChanged, brandSelected, brandCleared } = searchSlice.actions;
export default searchSlice.reducer;
