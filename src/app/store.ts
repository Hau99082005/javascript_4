"use client";

import { configureStore } from "@reduxjs/toolkit";
import CategoryReducer from "@/reduxslice/categorySlice";
import UnitsSlice from "@/reduxslice/UnitsSlice";
import supplierReducer from "@/reduxslice/supplierSlice";
import customerSlice from '@/reduxslice/customerSlice';
import productSlice from '@/reduxslice/productSlice';

export const store = configureStore({
    reducer: {
        categories: CategoryReducer,
        units: UnitsSlice,
        suppliers: supplierReducer,
        customers: customerSlice,
        products: productSlice,
    }
})

export type AppDispatch = typeof store.dispatch;
