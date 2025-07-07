import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Định nghĩa type cho Category
export interface Category {
  _id: string;
  name: string;
  status: boolean;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/user/category`);
      if (!response.ok) {
        return rejectWithValue('Không thể lấy danh mục');
      }
      const data = await response.json();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Đã có sự cố xảy ra');
    }
  }
);

export const addCategory = createAsyncThunk<Category, { name: string }, { rejectValue: string }>(
  'categories/addCategory',
  async (newCategory, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/user/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newCategory, status: true }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData?.message || 'Lỗi khi thêm danh mục');
      }
      const data = await response.json();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Đã có sự cố xảy ra');
    }
  }
);

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/user/category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        return rejectWithValue('Lỗi khi xoá danh mục');
      }
      return categoryId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Đã có sự cố xảy ra');
    }
  }
);

export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'categories/updateCategory',
  async (updateCategory, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/user/category/${updateCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateCategory),
      });
      if (!response.ok) {
        return rejectWithValue('Lỗi khi cập nhật danh mục');
      }
      const data = await response.json();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Đã có sự cố xảy ra');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message || null;
      });
  },
});

export default categorySlice.reducer;