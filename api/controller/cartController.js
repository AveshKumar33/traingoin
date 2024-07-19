const cartSchema = require("../modal/cartModal");
// const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");
const customizedProductSchema = require("../modal/customizeProductModel");
const parameterPositionImageSchema = require("../modal/parameterPositionImageModal");
const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");
const customizeComboRectangleModalSchema = require("../modal/customizeComboRectangleModal");
const customizedComboModelSchema = require("../modal/customizedComboModel");
const wishlistSchema = require("../modal/wishlistModel");
const customizedProductCombinationSchema = require("../modal/customizeProductCombinationModal");
const dotProductSchema = require("../modal/dotProductModalNew");
const customizeDotProductSchema = require("../modal/customizeDotProductModal");
const { ObjectId } = require("mongodb");
const { handleError } = require("../utils/handleError");

// using to add product from wishlist
const addProductsToCart = async (req, res, next) => {
  try {
    const products = req.body;
    const userId = req.user.id;

    const productsWithoutId = products.map((product) => {
      const { _id, ...rest } = product;
      return { ...rest, userId };
    });

    await cartSchema.insertMany(productsWithoutId);

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const addToCart = async (req, res, next) => {
  try {
    const cartData = await new cartSchema({
      ...req.body,
      userId: req.user.id,
    });

    await cartData.save();

    res.status(201).json({
      success: true,
      data: cartData,
      message: "Added to wishlist",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCartSingleProduct = async (req, res, next) => {
  try {
    let matchQuery = { singleProductId: { $ne: null } };

    if (req.params.userId) {
      matchQuery.userId = new ObjectId(req.params.userId);
    }

    if (req.params.productId !== "null") {
      matchQuery.singleProductId = new ObjectId(req.params.productId);
    }

    const cartData = await cartSchema.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCartCustomizeProduct = async (req, res, next) => {
  try {
    let matchQuery = { customizedProductId: { $ne: null } };

    if (req.params.userId) {
      matchQuery.userId = new ObjectId(req.params.userId);
    }

    if (req.params.productId !== "null") {
      matchQuery.customizedProductId = new ObjectId(req.params.productId);
    }

    const cartData = await cartSchema.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCartSingleDotProduct = async (req, res, next) => {
  try {
    let matchQuery = { singleDotProductId: { $ne: null } };

    if (req.params.userId) {
      matchQuery.userId = new ObjectId(req.params.userId);
    }

    if (req.params.productId !== "null") {
      matchQuery.singleDotProductId = new ObjectId(req.params.productId);
    }

    const cartData = await cartSchema.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCartCustomizeDotProduct = async (req, res, next) => {
  try {
    let matchQuery = { customizeDotProductId: { $ne: null } };

    if (req.params.userId) {
      matchQuery.userId = new ObjectId(req.params.userId);
    }

    if (req.params.productId !== "null") {
      matchQuery.customizeDotProductId = new ObjectId(req.params.productId);
    }

    const cartData = await cartSchema.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCartCustomizeComboProduct = async (req, res, next) => {
  try {
    let matchQuery = { customizedComboId: { $ne: null } };

    if (req.params.userId) {
      matchQuery.userId = new ObjectId(req.params.userId);
    }

    if (req.params.productId !== "null") {
      matchQuery.customizedComboId = new ObjectId(req.params.productId);
    }

    const cartData = await cartSchema.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getAllCartSingleProductForCart = async (req, res, next) => {
  try {
    const search = req.body;

    const query = {};

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let cartData = search;

    if (search?.length === 0 && req.params.userId !== "unauthenticated") {
      cartData = await cartSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    }

    const productCombinations = [];

    if (cartData?.length > 0) {
      for (let data of cartData) {
        if (!data?.singleProductId) {
          continue;
        }
        let productCombination = await singleProductCombinationSchema.aggregate(
          [
            {
              $match: {
                singleProductId: new ObjectId(data?.singleProductId),
                combinations: {
                  $all: data.singleProductCombinations.map((combination) => ({
                    $elemMatch: {
                      attributeId: new ObjectId(combination.attributeId),
                      parameterId: new ObjectId(combination.parameterId),
                    },
                  })),
                },
              },
            },
          ]
        );

        const result = await singleProductCombinationSchema.populate(
          productCombination,
          [
            {
              path: "singleProductId",
              populate: [
                { path: "attribute" },
                { path: "Collection", select: "title url" },
              ],
            },
          ]
        );

        if (result?.length > 0) {
          productCombinations.push({ ...data, ...result[0], _id: data?._id });
        }
      }
    }

    res.status(201).json({
      success: true,
      data: productCombinations,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getAllCartCustomizedProductsForCart = async (req, res, next) => {
  try {
    const search = req.body;

    const query = {
      customizedProductId: { $ne: null },
    };

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let cartData = search;
    let cartDataForUI = search;

    if (search?.length === 0 && req.params.userId !== "unauthenticated") {
      cartData = await cartSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    }

    if (search?.length > 0 && req.params.userId === "unauthenticated") {
      cartDataForUI = search.filter((prodId) => prodId.customizedProductId);

      const productIds = cartDataForUI.map(
        (prod) => new ObjectId(prod.customizedProductId)
      );

      cartData = await customizedProductCombinationSchema.aggregate([
        {
          $match: {
            productId: { $in: productIds },
          },
        },

        {
          $match: {
            $or: [
              {
                Front: {
                  $elemMatch: { parameterId: { $exists: true, $ne: null } },
                },
              },
              {
                Front: {
                  $elemMatch: { positionId: { $exists: true, $ne: null } },
                },
              },
              {
                CB: {
                  $elemMatch: { parameterId: { $exists: true, $ne: null } },
                },
              },
              {
                CB: {
                  $elemMatch: { positionId: { $exists: true, $ne: null } },
                },
              },
              {
                IB: {
                  $elemMatch: { parameterId: { $exists: true, $ne: null } },
                },
              },
              {
                IB: {
                  $elemMatch: { positionId: { $exists: true, $ne: null } },
                },
              },
              {
                SAF: {
                  $elemMatch: { parameterId: { $exists: true, $ne: null } },
                },
              },
              {
                SAF: {
                  $elemMatch: { positionId: { $exists: true, $ne: null } },
                },
              },
            ],
          },
        },
      ]);
    }

    const carts =
      search?.length === 0 && req.params.userId !== "unauthenticated"
        ? cartData
        : cartDataForUI;

    const updatedWishlist = [];

    for (let cart of carts) {
      const arrays = ["Front", "SAF", "CB", "IB"];

      const combinations = {};

      const customizeProduct = await customizedProductSchema.aggregate([
        { $match: { _id: new ObjectId(cart.customizedProductId) } },
      ]);

      const populatedcCstomizeProduct = await customizedProductSchema.populate(
        customizeProduct,
        [
          {
            path: "Collection",
            select: "title url",
          },
          {
            path: "attribute",
            populate: [{ path: "UOMId", select: "name" }],
            select: "-createdAt -updatedAt -createdBy -updatedBy",
          },
        ]
      );

      for (let array of arrays) {
        const arrayCombinations = [];

        for (let field of cart[array]) {
          if (!field?.isShow) {
            continue;
          }

          const parameterPositionData = await parameterPositionImageSchema.aggregate(
            [
              {
                $match: {
                  attributeId: new ObjectId(field?.attributeId),
                  parameterId: new ObjectId(field?.parameterId),
                  positionId: new ObjectId(field?.positionId),
                },
              },
            ]
          );

          if (parameterPositionData.length > 0) {
            const populatedCombination = await parameterPositionImageSchema.populate(
              parameterPositionData,
              [
                {
                  path: "attributeId",
                  populate: [{ path: "UOMId", select: "name" }],
                  select: "-createdAt -updatedAt -createdBy -updatedBy",
                },
                {
                  path: "positionId",
                  select: "-createdAt -updatedAt -createdBy -updatedBy",
                },
                {
                  path: "parameterId",
                  select: "-createdAt -updatedAt -createdBy -updatedBy",
                  populate: [
                    {
                      path: "attributeId",
                      populate: [{ path: "UOMId", select: "name" }],
                      select: "-createdAt -updatedAt -createdBy -updatedBy",
                    },
                  ],
                },
              ]
            );
            arrayCombinations.push(populatedCombination[0]);
          }
        }

        combinations[`${array}Combinations`] = arrayCombinations;
      }

      updatedWishlist.push({
        ...cart,
        customizeProduct: populatedcCstomizeProduct[0],
        ...combinations,
      });
    }

    const currentSchema =
      req.params.userId === "unauthenticated"
        ? customizedProductCombinationSchema
        : cartSchema;

    const result = await currentSchema.populate(cartData, [
      {
        path: "CB.parameterId",
        select: "name price",
        populate: {
          path: "attributeId",
          select: "Name UOMId",
          populate: {
            path: "UOMId",
            select: "name",
          },
        },
      },
      {
        path: "Front.parameterId",
        select: "name price",
        populate: {
          path: "attributeId",
          select: "Name UOMId",
          populate: {
            path: "UOMId",
            select: "name",
          },
        },
      },
      {
        path: "IB.parameterId",
        select: "name price",
        populate: {
          path: "attributeId",
          select: "Name UOMId",
          populate: {
            path: "UOMId",
            select: "name",
          },
        },
      },
      {
        path: "SAF.parameterId",
        select: "name price",
        populate: {
          path: "attributeId",
          select: "Name UOMId",
          populate: {
            path: "UOMId",
            select: "name",
          },
        },
      },
      {
        path:
          req.params.userId === "unauthenticated"
            ? "productId"
            : "customizedProductId",
        populate: [
          { path: "Collection" },
          {
            path: "attribute",
            select: "Name PrintName UOMId",
            populate: [
              {
                path: "UOMId",
                select: "name",
              },
            ],
          },
        ],
      },
    ]);

    res.status(200).json({
      success: true,
      data: updatedWishlist,
      products: result,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    console.log("error", error);
    next(handleError(500, error.message));
  }
};

const getAllCartDotProductsForCart = async (req, res, next) => {
  try {
    const search = req.body;
    const query = {
      $or: [
        { singleDotProductId: { $ne: null } },
        { customizeDotProductId: { $ne: null } },
      ],
    };

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let cartData = search;
    let resultSP = [];
    let resultCP = [];
    const singleDotProduct = [];
    const customizeDotProduct = [];

    if (search?.length === 0 && req.params.userId !== "unauthenticated") {
      cartData = await cartSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    }

    if (cartData?.length > 0) {
      if (search?.length > 0) {
        cartData = search.filter(
          (data) => data?.singleDotProductId || data?.customizeDotProductId
        );
      }

      const productIds = cartData.map((data) => {
        if (data?.singleDotProductId) {
          return new ObjectId(data?.singleDotProductId);
        } else if (data?.customizeDotProductId) {
          return new ObjectId(data?.customizeDotProductId);
        }
      });

      // fetching single dot products
      const dotProductFilters = await dotProductSchema.aggregate([
        {
          $match: { _id: { $in: productIds } },
        },
        {
          $match: { status: 1 },
        },
        {
          $sort: { displaySequence: 1 },
        },
      ]);

      resultSP = await dotProductSchema.populate(dotProductFilters, [
        {
          path: "dotProductImageIds",
          populate: {
            path: "dots.productId",
            select: "ProductName Urlhandle Collection GSTIN",
            populate: {
              path: "Collection",
              select: "title url",
            },
          },
          select: "-createdAt -updatedAt -createdBy -updatedBy ",
        },
      ]);
      if (resultSP?.length > 0) {
        for (let product of resultSP) {
          const cartDetails = cartData.find((data) => {
            if (
              data?.singleDotProductId &&
              data?.singleDotProductId.toString() === product?._id.toString()
            ) {
              return data;
            }
          });

          const combination = [];

          for (let dotsImageIds of product?.dotProductImageIds) {
            for (let dots of dotsImageIds?.dots) {
              const productCombinations = await singleProductCombinationSchema.aggregate(
                [
                  {
                    $match: {
                      singleProductId: new ObjectId(dots?.productId?._id),
                      isDefault: true,
                    },
                  },
                ]
              );

              const result = await singleProductCombinationSchema.populate(
                productCombinations,
                [
                  {
                    path: "singleProductId",
                    select: "ProductName Urlhandle Collection GSTIN",
                  },
                ]
              );
              combination.push(result[0]);
            }
          }
          singleDotProduct.push({
            ...cartDetails,
            ...product,
            productCombination: combination,
            _id: cartDetails?._id,
          });
        }
      }

      // fetching dot customized products
      // Perform the second query
      const customizeDotProductFilters = await customizeDotProductSchema.aggregate(
        [
          {
            $match: { _id: { $in: productIds } },
          },
          {
            $match: { status: 1 },
          },
          {
            $sort: { displaySequence: 1 },
          },
        ]
      );

      resultCP = await customizeDotProductSchema.populate(
        customizeDotProductFilters,
        [
          {
            path: "dotProductImageIds",
            populate: {
              path: "dots.productId",
              select: "ProductName Urlhandle Collection GSTIN",
            },
            select: "-createdAt -updatedAt -createdBy -updatedBy ",
          },
        ]
      );

      if (resultCP && resultCP?.length > 0) {
        for (let result of resultCP) {
          const cartDetails = cartData.find((data) => {
            if (data?.customizeDotProductId) {
              return (
                data?.customizeDotProductId.toString() ===
                result?._id.toString()
              );
            }
          });
          const customizeCombination = [];

          for (let dotsImageIds of result?.dotProductImageIds) {
            for (let dots of dotsImageIds?.dots) {
              const customizedProductsCombinations = await customizedProductCombinationSchema.aggregate(
                [
                  {
                    $match: {
                      productId: new ObjectId(dots?.productId?._id),
                    },
                  },
                ]
              );

              const customizedProductsCombinationsData = await customizedProductCombinationSchema.populate(
                customizedProductsCombinations,
                [
                  {
                    path: "CB.parameterId",
                    select: "name price",
                    populate: {
                      path: "attributeId",
                      select: "Name UOMId",
                      populate: {
                        path: "UOMId",
                        select: "name",
                      },
                    },
                  },
                  {
                    path: "Front.parameterId",
                    select: "name price",
                    populate: {
                      path: "attributeId",
                      select: "Name UOMId",
                      populate: {
                        path: "UOMId",
                        select: "name",
                      },
                    },
                  },
                  {
                    path: "IB.parameterId",
                    select: "name price",
                    populate: {
                      path: "attributeId",
                      select: "Name UOMId",
                      populate: {
                        path: "UOMId",
                        select: "name",
                      },
                    },
                  },
                  {
                    path: "SAF.parameterId",
                    select: "name price",
                    populate: {
                      path: "attributeId",
                      select: "Name UOMId",
                      populate: {
                        path: "UOMId",
                        select: "name",
                      },
                    },
                  },
                  {
                    path: "productId",
                    populate: {
                      path: "Collection",
                      select: "url",
                    },
                  },
                ]
              );

              customizeCombination.push(customizedProductsCombinationsData[0]);
            }
          }

          customizeDotProduct.push({
            ...cartDetails,
            ...result,
            productCombination: customizeCombination,
            _id: cartDetails?._id,
          });
        }
      }
    }

    const mergedFilters = [...singleDotProduct, ...customizeDotProduct];

    res.status(200).json({
      success: true,
      data: mergedFilters,
      cartData,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getAllCustomizeComboForCart = async (req, res, next) => {
  try {
    const search = req.body;

    const query = {
      customizedComboId: { $ne: null },
    };

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let cartData = [];
    let cartDataForUI = [];

    const customizeComboProductIds = [];

    if (
      req.params.userId !== "unauthenticated" &&
      search &&
      search?.length === 0
    ) {
      cartData = await cartSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      // its not being populated so we can match to find it is in faviourate or not
      cartDataForUI = await cartSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      cartData = await cartSchema.populate(cartData, [
        { path: "customizedComboId" },
        { path: "customizedComboRectangle.customizedComboRectangleId" },
        {
          path: "customizedComboRectangle.customizedProductId",
          populate: [
            {
              path: "Collection",
              select: "title url",
            },
            {
              path: "attribute",
              populate: [{ path: "UOMId", select: "name" }],
              select: "-createdAt -updatedAt -createdBy -updatedBy",
            },
          ],
        },
      ]);
    }

    if (
      req.params.userId === "unauthenticated" &&
      search &&
      search?.length > 0
    ) {
      const filteredData = search?.filter((data) => data.customizedComboId);

      cartDataForUI = filteredData;

      const cartDataForUIStringify = JSON.stringify(filteredData);
      const parsedData = JSON.parse(cartDataForUIStringify);

      for (let data of parsedData) {
        const customizedCombo = await customizedComboModelSchema.aggregate([
          {
            $match: {
              _id: new ObjectId(data.customizedComboId),
            },
          },
        ]);

        for (let rectangle of data.customizedComboRectangle) {
          const customizedComboRectangle = await customizeComboRectangleModalSchema.aggregate(
            [
              {
                $match: {
                  _id: new ObjectId(rectangle.customizedComboRectangleId),
                },
              },
            ]
          );

          const customizedProduct = await customizedProductSchema.aggregate([
            {
              $match: {
                _id: new ObjectId(rectangle.customizedProductId),
              },
            },
          ]);

          const populatedData = await customizedProductSchema.populate(
            customizedProduct,
            [
              {
                path: "Collection",
                select: "title url",
              },
              {
                path: "attribute",
                populate: [{ path: "UOMId", select: "name" }],
                select: "-createdAt -updatedAt -createdBy -updatedBy",
              },
            ]
          );

          rectangle.customizedComboRectangleId = customizedComboRectangle[0];
          rectangle.customizedProductId = populatedData[0];
        }

        data.customizedComboId = customizedCombo[0];
      }

      cartData = parsedData;
    }

    if (cartDataForUI) {
      for (let product of cartDataForUI) {
        customizeComboProductIds.push(new ObjectId(product?.customizedComboId));
      }
    }

    for (let cart of cartData) {
      for (let i = 0; i < cart?.customizedComboRectangle.length; i++) {
        const rectangle = cart.customizedComboRectangle[i];
        const arrays = ["Front", "SAF", "CB", "IB"];

        const combinations = {};

        for (let array of arrays) {
          const arrayCombinations = await Promise.all(
            rectangle[array].map(async (field) => {
              const parameterPositionData = await parameterPositionImageSchema.aggregate(
                [
                  {
                    $match: {
                      attributeId: new ObjectId(field?.attributeId),
                      parameterId: new ObjectId(field?.parameterId),
                      positionId: new ObjectId(field?.positionId),
                    },
                  },
                ]
              );

              if (parameterPositionData.length > 0) {
                const populatedCombination = await parameterPositionImageSchema.populate(
                  parameterPositionData,
                  [
                    {
                      path: "attributeId",
                      populate: [{ path: "UOMId", select: "name" }],
                      select: "-createdAt -updatedAt -createdBy -updatedBy",
                    },
                    {
                      path: "positionId",
                      select: "-createdAt -updatedAt -createdBy -updatedBy",
                    },
                    {
                      path: "parameterId",
                      select: "-createdAt -updatedAt -createdBy -updatedBy",
                      populate: [
                        {
                          path: "attributeId",
                          populate: [{ path: "UOMId", select: "name" }],
                          select: "-createdAt -updatedAt -createdBy -updatedBy",
                        },
                      ],
                    },
                  ]
                );
                return populatedCombination[0];
              } else {
                return null;
              }
            })
          );

          combinations[`${array}Combinations`] = arrayCombinations;
        }

        cart.customizedComboRectangle[i] = {
          ...rectangle,
          ...combinations,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: cartData,
      // products: cartDataForUI,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const updateCartProductQuantity = async (req, res, next) => {
  try {
    const updates = await cartSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(201).json({
      data: updates,
      success: true,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const deleteCartProduct = async (req, res, next) => {
  try {
    await cartSchema.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
const userCartEmpty = async (req, res, next) => {
  try {
    const data = await cartSchema.deleteMany({ userId: req.params.userId });
    // console.log("Cart deleted successfully ", data);
    res.status(200).json({
      success: true,
      message: "Cart Empty  Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const cartProductMoveToWishlist = async (req, res, next) => {
  try {
    const existingData = await cartSchema.aggregate([
      { $match: { _id: new ObjectId(req.params.id) } },
    ]);

    if (existingData && existingData?.length > 0) {
      const newData = await new wishlistSchema(existingData[0]);

      const savedData = newData.save();

      if (savedData) {
        await cartSchema.findByIdAndDelete(req.params.id);
      }
    }

    res.status(201).json({
      success: true,
      message: "Successfully Moved",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
const getCartProductById = async (req, res, next) => {
  try {
    const cartItem = await cartSchema.aggregate([
      { $match: { _id: new ObjectId(req.params.id) } },
    ]);
    res.status(200).json({
      success: true,
      data: cartItem,
      message: " cart Item got Successfully ",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
const getCartCustomixedProductCombinationById = async (req, res, next) => {
  try {
    const updatedWishlist = [];
    const existingProduct = await cartSchema.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
    ]);

    let requestProduct;
    if (existingProduct?.length > 0) {
      requestProduct = existingProduct[0];

      const arrays = ["Front", "SAF", "CB", "IB"];
      const combinations = {};
      const customizeProduct = await customizedProductSchema.aggregate([
        { $match: { _id: new ObjectId(requestProduct.customizedProductId) } },
      ]);
      const populatedcCstomizeProduct = await customizedProductSchema.populate(
        customizeProduct,
        [
          {
            path: "Collection",
            select: "title url",
          },
          {
            path: "attribute",
            populate: [{ path: "UOMId", select: "name" }],
            select: "-createdAt -updatedAt -createdBy -updatedBy",
          },
        ]
      );

      for (let array of arrays) {
        const arrayCombinations = [];

        for (let field of requestProduct[array]) {
          if (!field?.isShow) {
            continue;
          }

          const parameterPositionData = await parameterPositionImageSchema.aggregate(
            [
              {
                $match: {
                  attributeId: new ObjectId(field?.attributeId),
                  parameterId: new ObjectId(field?.parameterId),
                  positionId: new ObjectId(field?.positionId),
                },
              },
            ]
          );

          if (parameterPositionData.length > 0) {
            const populatedCombination = await parameterPositionImageSchema.populate(
              parameterPositionData,
              [
                {
                  path: "attributeId",
                  select: "-createdAt -updatedAt -createdBy -updatedBy",
                },
                {
                  path: "positionId",
                  select: "-createdAt -updatedAt -createdBy -updatedBy",
                },
                {
                  path: "parameterId",
                  select: "-createdAt -updatedAt -createdBy -updatedBy",
                  populate: [
                    {
                      path: "attributeId",
                      populate: [{ path: "UOMId", select: "name" }],
                      select: "-createdAt -updatedAt -createdBy -updatedBy",
                    },
                  ],
                },
              ]
            );
            arrayCombinations.push(populatedCombination[0]);
          }
        }

        combinations[`${array}Combinations`] = arrayCombinations;
      }

      updatedWishlist.push({
        customizeProduct: populatedcCstomizeProduct[0],
        ...combinations,
      });
    } else {
      throw new Error("Product Not found");
    }

    res.status(200).json({
      success: true,
      data: {
        updatedWishlist: updatedWishlist,
        customizeProductHeight: requestProduct?.customizeProductHeight,
        customizeProductWidth: requestProduct?.customizeProductWidth,
        customizedProductBackSelected:
          requestProduct?.customizedProductBackSelected,
      },
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

module.exports = {
  addToCart,
  addProductsToCart,
  getCartSingleProduct,
  getCartCustomizeProduct,
  getCartSingleDotProduct,
  getCartCustomizeDotProduct,
  getAllCartSingleProductForCart,
  getAllCartCustomizedProductsForCart,
  getAllCustomizeComboForCart,
  getAllCartDotProductsForCart,
  getCartCustomizeComboProduct,
  updateCartProductQuantity,
  deleteCartProduct,
  cartProductMoveToWishlist,
  getCartProductById,
  getCartCustomixedProductCombinationById,
  userCartEmpty,
};
