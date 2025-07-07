"use client";

import { configureStore } from "@reduxjs/toolkit";
import CategoryReducer from "@/reduxslice/categorySlice";

export const store = configureStore({
    reducer: {
        categories: CategoryReducer,
    }
})
