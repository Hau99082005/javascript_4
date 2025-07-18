/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  oldPrice: number;
  quantity: number;
  image: string;
  gallery: string;
  brand: string;
  model: string;
  warranty: string;
  specs: Record<string, any>;
  slug: string;
  status: boolean;
  isFeatured: boolean;
  unitNameId: string;
  categoryNameId: string;
  supplierNameId: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const updateProduct = createAsyncThunk("products/updateProduct",async(updateProduct: Product) => {
    const response = await fetch(`${process.env.API}/admin/products/${updateProduct._id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateProduct)
    })
    const data = await response.json()
    return data
})

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await fetch(`${process.env.API}/admin/products`);
    const data = await response.json();
    return data;
  }
);

// Add new product
export const addProduct = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/addProduct", async (newProduct, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.API}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Lỗi khi thêm sản phẩm");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Đã có lỗi xảy ra! Vui lòng thử lại sau");
  }
});

// Delete product by ID
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (productId) => {
    await fetch(`${process.env.API}/admin/products/${productId}`, {
      method: "DELETE",
    });
    return productId; // trả về id
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Thêm sản phẩm
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Load sản phẩm
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Đã xảy ra lỗi";
      })
      // Xoá sản phẩm
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (prod) => prod._id !== action.payload
        );
      })
      //update sản phẩm
      .addCase(updateProduct.fulfilled, (state, action) =>{
        if(action.payload) {
          const index = state.products.findIndex(prod => prod._id === action.payload._id);
          state.products[index] = action.payload
        }
      });
  },
});

export default productSlice.reducer;
