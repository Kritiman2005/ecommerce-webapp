import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchProductReviews = createAsyncThunk(
  "reviews/fetchByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      return data.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/create",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/reviews/product/${productId}`, { rating, comment });
      return data.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;
