"use client";

import { configureStore } from "@reduxjs/toolkit";
import CategoryReducer from "@/reduxslice/categorySlice";
import UnitsSlice from "@/reduxslice/UnitsSlice";
import supplierReducer from "@/reduxslice/supplierSlice";

export const store = configureStore({
    reducer: {
        categories: CategoryReducer,
        units: UnitsSlice,
        suppliers: supplierReducer,
    }
})

export type AppDispatch = typeof store.dispatch;
