// src/api/currencyApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';

interface ExchangeRatesResponse {
  base: string;
  rates: Record<string, number>;
}

interface ConvertCurrencyRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

interface ConvertCurrencyResponse {
  amount: number;
  currency: string;
}

export const currencyApi = createApi({
  reducerPath: 'currencyApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getExchangeRates: builder.query<ExchangeRatesResponse, string>({
      query: (baseCurrency) => ({
        url: `/currency/rates?base=${baseCurrency}`,
        method: 'GET',
      }),
    }),
    convertCurrency: builder.mutation<ConvertCurrencyResponse, ConvertCurrencyRequest>({
      query: (payload) => ({
        url: '/currency/convert',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useGetExchangeRatesQuery, useConvertCurrencyMutation } = currencyApi;
