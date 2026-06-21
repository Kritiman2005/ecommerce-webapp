import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const createOrder = createAsyncThunk(
  "orders/create",
  async (shippingAddress, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders", { shippingAddress });
      return data.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to place order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/my-orders");
      return data.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/all");
      return data.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status });
      return data.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    allOrders: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearOrderMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders.unshift(action.payload);
        state.message = "Order placed successfully!";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.allOrders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.allOrders[index] = action.payload;
      });
  },
});

export const { clearOrderMessage } = orderSlice.actions;
export default orderSlice.reducer;
