import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";
// import { redirect } from "react-router-dom";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const { data } = await axiosInstance.get(
      "/api/product?CustomizedProduct=false"
    );

    return data.data;
  }
);
export const fetchProductsForBundle = createAsyncThunk(
  "products/fetchProductsForBundle",
  async () => {
    const { data } = await axiosInstance.get("/api/product");
    return data.data;
  }
);

export const fetchCustomizedProducts = createAsyncThunk(
  "products/fetchCustomizedProducts",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/product?CustomizedProduct=true"
      );

      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchProductsDetails = createAsyncThunk(
  "products/fetchProductsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/product/${id}`);

      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const fetchProductsDetailsByUrl = createAsyncThunk(
  "products/fetchProductsDetailsByUrl",
  async (productname) => {
    try {
      await axiosInstance.post(
        `/api/product/Urlhandle`,
        {
          Urlhandle: productname,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      // let varient = data?.data[0]?.varient?.filter((ele) => ele?.Display === false);

      return {};
      // return data.data[0];
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productdata) => {
    try {
      const response = await axiosInstance.post("/api/product", productdata, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/${id}`,
        productdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/product/${productId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return productId;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

//Delete Attribute Group
// http://localhost:7000/api/product/removeattribute/6488102fb31656325f94f386/Color

export const deleteAttributeGroup = createAsyncThunk(
  "products/deleteAttributeGroup",
  async ({ id, name }) => {
    try {
      alert(id, name);

      const { data } = await axiosInstance.put(
        `/api/product/removeattribute/${id}/${name}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const addAttributeGroup = createAsyncThunk(
  "products/addAttributeGroup",
  async ({ id, attributedata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/addattribute/${id}`,
        attributedata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

// Add Attribute Group Item

export const addAttributeGroupItem = createAsyncThunk(
  "products/addAttributeGroupItem",
  async ({ id, name }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/addattributeitem/${id}/${name}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const removeAttributeGroupItem = createAsyncThunk(
  "products/removeAttributeGroupItem",
  async ({ id, name }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/removeattributeitem/${id}/${name}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const updateVarientValue = createAsyncThunk(
  "products/updateVarientValue",
  async ({ id, updatedData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/updatevarient/${id}`,
        updatedData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);
export const updateManyVarientApi = createAsyncThunk(
  "products/updateManyVarientApi",
  async ({ id, updatedData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/updatevarientMulti/${id}`,
        updatedData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteVarientImage = createAsyncThunk(
  "products/deleteVarientImage",
  async ({ id, updatedData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/deletevarientimage/${id}`,
        updatedData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const uploadVarientImage = createAsyncThunk(
  "products/uploadVarientImage",
  async ({ id, updatedData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/updatevarientimage/${id}`,
        updatedData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const changeVarientPosition = createAsyncThunk(
  "products/changeVarientPosition",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/changevarient/${id}`,
        updatedData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log("data.data", data.data);

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        // alert(error.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const changeImagePositionX = createAsyncThunk(
  "products/changeImagePositionX",

  async (attributedata, { rejectWithValue }) => {
    const { attributeId, productId, PositionX } = attributedata;
    try {
      const { data } = await axiosInstance.put(
        `/api/product/updateAttributeImagePosition/${attributeId}/${productId}`,
        {
          PositionX: PositionX,
        },

        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        // alert(error.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const changeImagePositionY = createAsyncThunk(
  "products/changeImagePositionY",
  async (attributedata, { rejectWithValue }) => {
    const { attributeId, productId, PositionY } = attributedata;

    try {
      const { data } = await axiosInstance.put(
        `/api/product/updateAttributeImagePosition/${attributeId}/${productId}`,
        {
          PositionY: PositionY,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        // alert(error.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const changeQuantity = createAsyncThunk(
  "products/changeQuantity",
  async (attributedata, { rejectWithValue }) => {
    const { attributeId, productId, Quantity } = attributedata;

    try {
      const { data } = await axiosInstance.put(
        `/api/product/updateAttributeImagePosition/${attributeId}/${productId}`,
        {
          Quantity: Quantity,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const changeBack = createAsyncThunk(
  "products/changeBack",
  async (attributedata, { rejectWithValue }) => {
    const { attributeId, productId, PositionY, Quantity, PositionX, BackName } =
      attributedata;

    let updateobj = {};

    //Add position and Quantity based On Attribute BAck Name

    if (PositionX) {
      updateobj.PositionX = PositionX;
      updateobj.BackName = BackName;
    }

    if (PositionY) {
      updateobj.PositionY = PositionY;
      updateobj.BackName = BackName;
    }

    if (Quantity) {
      updateobj.Quantity = Quantity;
      updateobj.BackName = BackName;
    }

    try {
      const { data } = await axiosInstance.put(
        `/api/product/updateBackAttributeImagePosition/${attributeId}/${productId}`,
        updateobj,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);
export const AttributeSettingSlice = createAsyncThunk(
  "products/AttributeSettingSlice",
  async (attributedata, { rejectWithValue }) => {
    const { attributeId, productId } = attributedata;

    try {
      const { data } = await axiosInstance.put(
        `/api/product/AttributeSetting/${attributeId}/${productId}`,
        attributedata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data.data;
    } catch (error) {
      console.log(error, "check this error");
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const CustomizedProductByTags = createAsyncThunk(
  "products/CustomizedProductByTags",
  async (productdata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/product/producttag/customizedproduct`,
        productdata
      );
      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: "idle",
    error: null,
    message: "",
    productdetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get Products
      .addCase(fetchProductsForBundle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductsForBundle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchProductsForBundle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      // get fetchCustomizedProducts

      .addCase(fetchCustomizedProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizedProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchCustomizedProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Products Details

      .addCase(fetchProductsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(fetchProductsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Fetch product by url
      .addCase(fetchProductsDetailsByUrl.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductsDetailsByUrl.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(fetchProductsDetailsByUrl.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.products.push(action.payload.data);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state) => {
        state.loading = "rejected";
      })
      //Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.products = state.products.filter(
        //   (product) => product._id !== action.payload
        // );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      // Delete AttributeGroup

      .addCase(deleteAttributeGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteAttributeGroup.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.productdetails = action.payload;
      })
      .addCase(deleteAttributeGroup.rejected, (state) => {
        state.loading = "rejected";
      })

      //Add AttributeGroup

      .addCase(addAttributeGroup.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addAttributeGroup.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(addAttributeGroup.rejected, (state) => {
        state.loading = "rejected";
      })

      //Add AttributeGroup Item

      .addCase(addAttributeGroupItem.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addAttributeGroupItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(addAttributeGroupItem.rejected, (state) => {
        state.loading = "rejected";
      })

      //Remove Attribute Item Group

      .addCase(removeAttributeGroupItem.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(removeAttributeGroupItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(removeAttributeGroupItem.rejected, (state) => {
        state.loading = "rejected";
      })

      //Update Varient VAlue
      .addCase(updateVarientValue.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateVarientValue.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(updateVarientValue.rejected, (state) => {
        state.loading = "rejected";
      })
      //updateManyVarientApi Varient VAlue
      .addCase(updateManyVarientApi.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateManyVarientApi.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(updateManyVarientApi.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete Varient Image

      .addCase(deleteVarientImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteVarientImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(deleteVarientImage.rejected, (state) => {
        state.loading = "rejected";
      })

      // Change Varient Position
      .addCase(changeVarientPosition.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(changeVarientPosition.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(changeVarientPosition.rejected, (state) => {
        state.loading = "rejected";
      })

      //Change Images

      .addCase(uploadVarientImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(uploadVarientImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(uploadVarientImage.rejected, (state) => {
        state.loading = "rejected";
      })

      // changeImagePositionX

      .addCase(changeImagePositionX.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(changeImagePositionX.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(changeImagePositionX.rejected, (state) => {
        state.loading = "rejected";
      })

      //ChangeImagePOsitionY
      .addCase(changeImagePositionY.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(changeImagePositionY.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(changeImagePositionY.rejected, (state) => {
        state.loading = "rejected";
      })

      // changeQuantity

      .addCase(changeQuantity.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(changeQuantity.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(changeQuantity.rejected, (state) => {
        state.loading = "rejected";
      })

      //Change Back Attribute's Attribute Position and Quantity
      // changeBack

      .addCase(changeBack.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(changeBack.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(changeBack.rejected, (state) => {
        state.loading = "rejected";
      })
      .addCase(AttributeSettingSlice.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(AttributeSettingSlice.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(AttributeSettingSlice.rejected, (state) => {
        state.loading = "rejected";
      })
      .addCase(CustomizedProductByTags.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(CustomizedProductByTags.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(CustomizedProductByTags.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
