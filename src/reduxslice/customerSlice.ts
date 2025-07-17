import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu Customer
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image?: string;
  status?: boolean;
}

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
};

// Sửa lại deleteCustomer nhận đúng tham số
export const deleteCustomer = createAsyncThunk<string, string, { rejectValue: string }>(
  "customers/deleteCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/customers/${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Lỗi xoá khách hàng");
      }
      return customerId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Đã có lỗi xảy ra! vui lòng thử lại sau");
    }
  }
);

export const fetchCustomers = createAsyncThunk<Customer[], void, { rejectValue: string }>(
  "customers/fetchCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/customers`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Lỗi tải danh sách khách hàng");
      }
      const data = await response.json();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Đã có lỗi xảy ra! vui lòng thử lại sau.");
    }
  }
);

export const addCustomer = createAsyncThunk<Customer, Omit<Customer, "_id">, { rejectValue: string }>(
  "customers/addcustomer",
  async (newCustomer, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Lỗi thêm khách hàng");
      }
      const data = await response.json();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Đã có lỗi xảy ra! vui lòng thử lại");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi tải danh sách khách hàng";
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.loading = false;
        state.customers = action.payload;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.customers.push(action.payload);
        state.error = null;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.payload || "Lỗi thêm khách hàng";
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<string>) => {
        state.customers = state.customers.filter((customer) => customer._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload || "Lỗi xoá khách hàng";
      });
  },
});

export default customerSlice.reducer;