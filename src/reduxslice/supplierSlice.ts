import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  logoUrl?: string;
  logoData?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SupplierState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  loading: false,
  error: null,
};

// Xóa nhà cung cấp
export const deleteSupplier = createAsyncThunk<string, string, { rejectValue: string }>(
  'suppliers/deleteSupplier',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/supplier/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Xóa nhà cung cấp thất bại');
      }
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Xóa nhà cung cấp thất bại');
      }
      return rejectWithValue('Xóa nhà cung cấp thất bại');
    }
  }
);

// Cập nhật nhà cung cấp
export const updateSupplier = createAsyncThunk<Supplier, { id: string; data: Partial<Supplier> }, { rejectValue: string }>(
  'suppliers/updateSupplier',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/supplier/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Cập nhật nhà cung cấp thất bại');
      }
      const updated = await response.json();
      return updated.updatingSupplier;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Cập nhật nhà cung cấp thất bại');
      }
      return rejectWithValue('Cập nhật nhà cung cấp thất bại');
    }
  }
);

export const fetchSuppliers = createAsyncThunk<Supplier[]>(
  'suppliers/fetchSupplies',
  async () => {
   try {
    const response = await fetch(`${process.env.API}/admin/supplier`);
      const data = await response.json();
      return data;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error fetching suppliers", error);
      throw error;
    }
  }
);

export const addSupplier = createAsyncThunk<Supplier, Supplier, { rejectValue: string }>(
  'suppliers/addSupplier',
  async (newSupplier, { rejectWithValue }) => {
 try {
   const response = await fetch(`${process.env.API}/admin/supplier`, {
    method: 'POST',
    headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupplier),
      });
      if (!response.ok) {
    const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Đã có lỗi xảy ra');
      }
      const data = await response.json();
console.log(data)  
      return data;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
    console.log("thêm vào nhà cung cấp thất bại", error);
    return rejectWithValue(error.message || 'Đã có lỗi xảy ra');
 }
  }
);

const supplierSlice = createSlice({
    name: "suppliers",
  initialState,
    reducers: {},
  extraReducers: (builder) => {
      builder
      .addCase(addSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
        if (action.payload) {
          state.suppliers.push(action.payload);
        }
      })
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
        state.loading = false;
        if (action.payload) {
          state.suppliers = action.payload;
        }
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default supplierSlice.reducer;