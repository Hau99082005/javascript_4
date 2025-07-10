import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho Unit nếu có
export interface Unit {
  // ví dụ: _id: string; name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface UnitsState {
  units: Unit[];
  loading: boolean;
  error: string | null;
}

export const fetchUnits=createAsyncThunk("units/fetchUnits", async()=> {
    try {
    const response = await fetch(`${process.env.API}/admin/units`)
    const data = await response.json()
    return data /* trả về dữ liệu data của units */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
     console.log("error fetching units",error)
    }
})

export const addUnit = createAsyncThunk(
  'units/addUnit',
  async (newUnits: { name: string; symbol: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUnits),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const data = await response.json();
      console.log(data);
      return data; // trả về data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('thêm vào đơn vị thất bại', error);
      return rejectWithValue(error.message || "Đã có sự cố xảy ra!");
    }
  }
);


export const deleteUnit = createAsyncThunk('units/deleteUnit', async(unitId,{rejectWithValue}) => {
    try {
     const response = await fetch(`${process.env.API}/admin/units/${unitId}`,{
        method: "DELETE",

     })
     if(!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
     }
     return unitId;
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any) {
        console.log("Error deleting error",error);
        return rejectWithValue(error.message || "Đã xảy ra lỗi!")
    }
})

export const updateUnit = createAsyncThunk(
  'units/updateUnit',
  async ({ id, name, symbol }: { id: string; name: string; symbol: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/units/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update: { name, symbol } }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const data = await response.json();
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error", error);
      return rejectWithValue(error.message || "Đã có sự cố xảy ra!");
    }
  }
);

const initialState: UnitsState = {
  units: [],
  loading: false,
  error: null,
}; 

const unitSlice = createSlice({
  name: "units",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUnits.pending, (state) => {
        state.loading = true
    })
    .addCase(fetchUnits.fulfilled,(state, action)=> {
        state.loading = false
        console.log("action unit", action)
        if(action.payload) {
            state.units=action.payload
        }
    })
    .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false
        console.log("action error", action)
        if(action.payload) {
            state.error = state.error
        }
    })
    .addCase(addUnit.fulfilled, (state, action) => {
      if (action.payload) {
        state.units.push(action.payload);
      }
    })
    .addCase(deleteUnit.fulfilled,(state, action) => {
        state.units= state.units.filter(units => units._id != action.payload);
    })
    .addCase(deleteUnit.rejected, (state, action) => {
        state.error = (action.payload as string) || "Lỗi khi xoá đơn vị"
    })
    .addCase(updateUnit.fulfilled, (state, action) => {
      if (action.payload && action.payload._id) {
        state.units = state.units.map(unit =>
          unit._id === action.payload._id ? action.payload : unit
        );
      }
    })
    .addCase(updateUnit.rejected, (state, action) => {
      state.error = (action.payload as string) || "Lỗi khi cập nhật đơn vị";
    })
  },
});

export default unitSlice.reducer;