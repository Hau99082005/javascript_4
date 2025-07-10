"use client";

import { configureStore } from "@reduxjs/toolkit";
import CategoryReducer from "@/reduxslice/categorySlice";
import UnitsSlice from "@/reduxslice/UnitsSlice";

export const store = configureStore({
    reducer: {
        categories: CategoryReducer,
        units: UnitsSlice
    }
})

export type AppDispatch = typeof store.dispatch;
