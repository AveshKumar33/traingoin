const wishlistSchema = require("../modal/wishlistModel");
const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");
const customizedProductSchema = require("../modal/customizeProductModel");
const parameterPositionImageSchema = require("../modal/parameterPositionImageModal");
const customizeComboRectangleModalSchema = require("../modal/customizeComboRectangleModal");
const customizedComboModelSchema = require("../modal/customizedComboModel");
const customizedProductCombinationSchema = require("../modal/customizeProductCombinationModal");
const dotProductSchema = require("../modal/dotProductModalNew");
const customizeDotProductSchema = require("../modal/customizeDotProductModal");
const { ObjectId } = require("mongodb");
const { handleError } = require("../utils/handleError");

// using to add product from wishlist
const addProductsToWishlist = async (req, res, next) => {
  try {
    const products = req.body;
    const userId = req.user.id;

    const productsWithoutId = products.map((product) => {
      const { _id, ...rest } = product;
      return { ...rest, userId };
    });

    await wishlistSchema.insertMany(productsWithoutId);

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.log(error);
    next(handleError(500, error.message));
  }
};

const addWishlist = async (req, res, next) => {
  try {
    const wishlistData = await new wishlistSchema({
      ...req.body,
      userId: req.user.id,
    });

    await wishlistData.save();
    res.status(201).json({
      success: true,
      data: wishlistData,
      message: "Added to wishlist",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: { userId: new ObjectId(req.user.id) },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    const data = await wishlistSchema.populate(wishlistData, [
      { path: "singleProductId" },
      { path: "singleProductCombinationId" },
      { path: "singleProductCombinations.attributeId" },
      { path: "singleProductCombinations.parameterId" },
    ]);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// for product list purposes
const getWishlistProduct = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: { userId: new ObjectId(req.user.id) },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getWishlistSingleProductByWishlistId = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getWishlistProductById = async (req, res, next) => {
  try {
    const searchFiled = req.query.search || "singleProductId";
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: {
          userId: new ObjectId(req.user.id),
          [searchFiled]: new ObjectId(req.params.id),
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getWishlistCustomizedProductById = async (req, res, next) => {
  try {
    const search = req.body;

    let wishlistData = [];
    let wishlistDataForUI =
      search?.filter((prodId) => prodId.customizedProductId) || [];

    if (req.params.userId !== "unauthenticated" && search?.length === 0) {
      wishlistData = await wishlistSchema.aggregate([
        {
          $match: {
            userId: new ObjectId(req.params.userId),
            customizedProductId: new ObjectId(req.params.id),
          },
        },
      ]);
    }

    const wishlists =
      search?.length === 0 && req.params.userId !== "unauthenticated"
        ? wishlistData
        : wishlistDataForUI;

    const updatedWishlist = [];

    for (let wishlist of wishlists) {
      const arrays = ["Front", "SAF", "CB", "IB"];

      const combinations = {};

      const customizeProduct = await customizedProductSchema.aggregate([
        { $match: { _id: new ObjectId(wishlist.customizedProductId) } },
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

        for (let field of wishlist[array]) {
          if (!field?.isShow) {
            continue;
          }

          const parameterPositionData =
            await parameterPositionImageSchema.aggregate([
              {
                $match: {
                  attributeId: new ObjectId(field?.attributeId),
                  parameterId: new ObjectId(field?.parameterId),
                  positionId: new ObjectId(field?.positionId),
                },
              },
            ]);

          if (parameterPositionData.length > 0) {
            const populatedCombination =
              await parameterPositionImageSchema.populate(
                parameterPositionData,
                [
                  {
                    path: "attributeId",
                    // populate: [{ path: "UOMId", select: "name" }],
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
        ...wishlist,
        customizeProduct: populatedcCstomizeProduct[0],
        ...combinations,
      });
    }

    res.status(201).json({
      success: true,
      data: updatedWishlist,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getWishlistCustomizedComboProductById = async (req, res, next) => {
  try {
    const search = req.body;

    const query = {};

    if (req.params.userId !== "unauthenticated") {
      query._id = new ObjectId(req.params.id);
      query.userId = new ObjectId(req.params.userId);
    }

    let wishlistData = [];
    let wishlistDataForUI = [];

    const customizeComboProductIds = [];

    if (
      req.params.userId !== "unauthenticated" &&
      search &&
      search?.length === 0
    ) {
      wishlistData = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      wishlistData = await wishlistSchema.populate(wishlistData, [
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

      wishlistDataForUI = filteredData;

      const wishlistDataForUIStringify = JSON.stringify(filteredData);
      const parsedData = JSON.parse(wishlistDataForUIStringify);

      for (let data of parsedData) {
        const customizedCombo = await customizedComboModelSchema.aggregate([
          {
            $match: {
              _id: new ObjectId(data.customizedComboId),
            },
          },
        ]);

        for (let rectangle of data.customizedComboRectangle) {
          const customizedComboRectangle =
            await customizeComboRectangleModalSchema.aggregate([
              {
                $match: {
                  _id: new ObjectId(rectangle.customizedComboRectangleId),
                },
              },
            ]);

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

      wishlistData = parsedData;
    }

    if (wishlistDataForUI) {
      for (let product of wishlistDataForUI) {
        customizeComboProductIds.push(new ObjectId(product?.customizedComboId));
      }
    }

    for (let wishlist of wishlistData) {
      for (let i = 0; i < wishlist?.customizedComboRectangle.length; i++) {
        const rectangle = wishlist.customizedComboRectangle[i];
        const arrays = ["Front", "SAF", "CB", "IB"];

        const combinations = {};

        for (let array of arrays) {
          const arrayCombinations = await Promise.all(
            rectangle[array].map(async (field) => {
              const parameterPositionData =
                await parameterPositionImageSchema.aggregate([
                  {
                    $match: {
                      attributeId: new ObjectId(field?.attributeId),
                      parameterId: new ObjectId(field?.parameterId),
                      positionId: new ObjectId(field?.positionId),
                    },
                  },
                ]);

              if (parameterPositionData.length > 0) {
                const populatedCombination =
                  await parameterPositionImageSchema.populate(
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
                            select:
                              "-createdAt -updatedAt -createdBy -updatedBy",
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

        wishlist.customizedComboRectangle[i] = {
          ...rectangle,
          ...combinations,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: wishlistData,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    console.log("error", error);
    next(handleError(500, error.message));
  }
};

// for use in by from elevation
const getAllCustomizeComboProductsByUserId = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: {
          customizedComboId: { $ne: null },
          userId: new ObjectId(req.params.userId),
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: wishlistData,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    console.log("error", error);
    next(handleError(500, error.message));
  }
};

// const getAllCustomizeComboProductsByUserIdForWishlist = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const search = JSON.parse(req.query.search);
//     const query = {
//       customizedComboId: { $ne: null },
//     };

//     if (req.params.userId !== "unauthenticated") {
//       query.userId = new ObjectId(req.params.userId);
//     }

//     let wishlistData = search;
//     let wishlistDataForUI = search;

//     const customizeComboProductIds = [];

//     if (search?.length === 0 && req.params.userId !== "unauthenticated") {
//       wishlistData = await wishlistSchema.aggregate([
//         {
//           $match: query,
//         },
//         {
//           $sort: { createdAt: 1 },
//         },
//       ]);

//       // its not being populated so we can match to find it is in faviourate or not
//       wishlistDataForUI = await wishlistSchema.aggregate([
//         {
//           $match: query,
//         },
//         {
//           $sort: { createdAt: 1 },
//         },
//       ]);

//       for (let product of wishlistDataForUI) {
//         customizeComboProductIds.push(new ObjectId(product?.customizedComboId));
//       }

//       customizeComboRectangle =
//         await customizeComboRectangleModalSchema.aggregate([
//           {
//             $match: {
//               customizedComboId: { $in: customizeComboProductIds },
//             },
//           },
//           {
//             $lookup: {
//               from: customizedComboModelSchema.collection.name,
//               localField: "customizedComboId",
//               foreignField: "_id",
//               as: "productDetails",
//             },
//           },
//           {
//             $group: {
//               _id: "$customizedComboId",
//               customizedComboId: {
//                 $first: { $arrayElemAt: ["$productDetails", 0] },
//               },
//               rectangles: { $push: "$$ROOT" },
//             },
//           },
//           {
//             $project: {
//               _id: 1,
//               customizedComboId: 1,
//               rectangles: 1,
//             },
//           },
//         ]);
//     }

//     if (search?.length > 0 && req.params.userId === "unauthenticated") {
//       wishlistDataForUI = search.filter((prodId) => prodId.customizedComboId);

//       const customizeProductIds = [];

//       for (let product of wishlistDataForUI) {
//         customizeComboProductIds.push(new ObjectId(product?.customizedComboId));
//         for (let rectangle of product) {
//           customizeProductIds.push(
//             new ObjectId(rectangle?.customizedProductId)
//           );
//         }
//       }

//       // customizeComboRectangle =
//       //   await customizeComboRectangleModalSchema.aggregate([
//       //     {
//       //       $match: {
//       //         customizedComboId: { $in: customizeComboProductIds },
//       //       },
//       //     },
//       //     {
//       //       $lookup: {
//       //         from: customizedComboModelSchema.collection.name,
//       //         localField: "customizedComboId",
//       //         foreignField: "_id",
//       //         as: "productDetails",
//       //       },
//       //     },
//       //     {
//       //       $group: {
//       //         _id: "$customizedComboId",
//       //         customizedComboId: {
//       //           $first: { $arrayElemAt: ["$productDetails", 0] },
//       //         },
//       //         rectangles: { $push: "$$ROOT" },
//       //       },
//       //     },
//       //     {
//       //       $project: {
//       //         _id: 1,
//       //         customizedComboId: 1,
//       //         rectangles: 1,
//       //       },
//       //     },
//       //   ]);
//     }

//     const currentSchema =
//       req.params.userId === "unauthenticated"
//         ? customizeComboRectangleModalSchema
//         : wishlistSchema;

//     wishlistData = await currentSchema.populate(wishlistData, [
//       { path: "customizedComboId" },
//       { path: "customizedComboRectangle.customizedComboRectangleId" },
//       {
//         path: "customizedComboRectangle.customizedProductId",
//         populate: [
//           {
//             path: "Collection",
//             select: "title url",
//           },
//           {
//             path: "attribute",
//             populate: [{ path: "UOMId", select: "name" }],
//             select: "-createdAt -updatedAt -createdBy -updatedBy",
//           },
//         ],
//       },
//     ]);

//     for (let wishlist of wishlistData) {
//       for (let i = 0; i < wishlist?.customizedComboRectangle.length; i++) {
//         const rectangle = wishlist.customizedComboRectangle[i];
//         const arrays = ["Front", "SAF", "CB", "IB"];

//         const combinations = {};

//         // const customizeProduct = await customizedProductSchema.aggregate([
//         //   { $match: { _id: new ObjectId(rectangle.customizedProductId) } },
//         // ]);

//         // const populatedCstomizeProduct = await customizedProductSchema.populate(
//         //   customizeProduct,
//         //   [
//         //     {
//         //       path: "Collection",
//         //       select: "title url",
//         //     },
//         //     {
//         //       path: "attribute",
//         //       populate: [{ path: "UOMId", select: "name" }],
//         //       select: "-createdAt -updatedAt -createdBy -updatedBy",
//         //     },
//         //   ]
//         // );

//         for (let array of arrays) {
//           const arrayCombinations = [];

//           for (let field of rectangle[array]) {
//             // if (!field?.isShow) {
//             //   continue;
//             // }

//             const parameterPositionData =
//               await parameterPositionImageSchema.aggregate([
//                 {
//                   $match: {
//                     attributeId: new ObjectId(field?.attributeId),
//                     parameterId: new ObjectId(field?.parameterId),
//                     positionId: new ObjectId(field?.positionId),
//                   },
//                 },
//               ]);

//             if (parameterPositionData.length > 0) {
//               const populatedCombination =
//                 await parameterPositionImageSchema.populate(
//                   parameterPositionData,
//                   [
//                     {
//                       path: "attributeId",
//                       populate: [{ path: "UOMId", select: "name" }],
//                       select: "-createdAt -updatedAt -createdBy -updatedBy",
//                     },
//                     {
//                       path: "positionId",
//                       select: "-createdAt -updatedAt -createdBy -updatedBy",
//                     },
//                     {
//                       path: "parameterId",
//                       select: "-createdAt -updatedAt -createdBy -updatedBy",
//                       populate: [
//                         {
//                           path: "attributeId",
//                           populate: [{ path: "UOMId", select: "name" }],
//                           select: "-createdAt -updatedAt -createdBy -updatedBy",
//                         },
//                       ],
//                     },
//                   ]
//                 );
//               arrayCombinations.push(populatedCombination[0]);
//             }
//           }

//           combinations[`${array}Combinations`] = arrayCombinations;
//         }

//         // wishlist.customizedComboRectangle[i] = {
//         //   ...rectangle,
//         //   customizeProduct: populatedCstomizeProduct[0],
//         //   ...combinations,
//         // };

//         wishlist.customizedComboRectangle[i] = {
//           ...rectangle,
//           ...combinations,
//         };

//         // updatedWishlist.push({
//         //   ...wishlist,
//         //   customizeProduct: populatedcCstomizeProduct[0],
//         //   ...combinations,
//         // });
//       }
//     }

//     // const currentSchema =
//     //   req.params.userId === "unauthenticated"
//     //     ? customizeComboRectangleModalSchema
//     //     : wishlistSchema;

//     // await currentSchema.populate(wishlistData, [{ path: "customizedComboId" }]);

//     // for(let data of updatedWishlist){

//     //   const foundRectangle = customizeComboRectangle.find(rec=> rec?._id === data?.customizedComboId)

//     // }

//     res.status(200).json({
//       success: true,
//       data: wishlistDataForUI,
//       product: wishlistData,
//       message: "Data Fetched Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     next(handleError(500, error.message));
//   }
// };

// for all wishlist show

// const getAllCustomizeComboProductsByUserIdForWishlist = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const query = {
//       customizedComboId: { $ne: null },
//     };

//     if (req.params.userId !== "unauthenticated") {
//       query.userId = new ObjectId(req.params.userId);
//     }

//     let wishlistData;
//     let wishlistDataForUI;

//     const customizeComboProductIds = [];

//     wishlistData = await wishlistSchema.aggregate([
//       {
//         $match: query,
//       },
//       {
//         $sort: { createdAt: 1 },
//       },
//     ]);

//     // its not being populated so we can match to find it is in faviourate or not
//     wishlistDataForUI = await wishlistSchema.aggregate([
//       {
//         $match: query,
//       },
//       {
//         $sort: { createdAt: 1 },
//       },
//     ]);

//     for (let product of wishlistDataForUI) {
//       customizeComboProductIds.push(new ObjectId(product?.customizedComboId));
//     }

//     wishlistData = await wishlistSchema.populate(wishlistData, [
//       { path: "customizedComboId" },
//       { path: "customizedComboRectangle.customizedComboRectangleId" },
//       {
//         path: "customizedComboRectangle.customizedProductId",
//         populate: [
//           {
//             path: "Collection",
//             select: "title url",
//           },
//           {
//             path: "attribute",
//             populate: [{ path: "UOMId", select: "name" }],
//             select: "-createdAt -updatedAt -createdBy -updatedBy",
//           },
//         ],
//       },
//     ]);

//     for (let wishlist of wishlistData) {
//       for (let i = 0; i < wishlist?.customizedComboRectangle.length; i++) {
//         const rectangle = wishlist.customizedComboRectangle[i];
//         const arrays = ["Front", "SAF", "CB", "IB"];

//         const combinations = {};

//         for (let array of arrays) {
//           const arrayCombinations = [];

//           for (let field of rectangle[array]) {
//             const parameterPositionData =
//               await parameterPositionImageSchema.aggregate([
//                 {
//                   $match: {
//                     attributeId: new ObjectId(field?.attributeId),
//                     parameterId: new ObjectId(field?.parameterId),
//                     positionId: new ObjectId(field?.positionId),
//                   },
//                 },
//               ]);

//             if (parameterPositionData.length > 0) {
//               const populatedCombination =
//                 await parameterPositionImageSchema.populate(
//                   parameterPositionData,
//                   [
//                     {
//                       path: "attributeId",
//                       populate: [{ path: "UOMId", select: "name" }],
//                       select: "-createdAt -updatedAt -createdBy -updatedBy",
//                     },
//                     {
//                       path: "positionId",
//                       select: "-createdAt -updatedAt -createdBy -updatedBy",
//                     },
//                     {
//                       path: "parameterId",
//                       select: "-createdAt -updatedAt -createdBy -updatedBy",
//                       populate: [
//                         {
//                           path: "attributeId",
//                           populate: [{ path: "UOMId", select: "name" }],
//                           select: "-createdAt -updatedAt -createdBy -updatedBy",
//                         },
//                       ],
//                     },
//                   ]
//                 );
//               arrayCombinations.push(populatedCombination[0]);
//             }
//           }

//           combinations[`${array}Combinations`] = arrayCombinations;
//         }

//         wishlist.customizedComboRectangle[i] = {
//           ...rectangle,
//           ...combinations,
//         };
//       }
//     }

//     res.status(200).json({
//       success: true,
//       data: wishlistDataForUI,
//       product: wishlistData,
//       message: "Data Fetched Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     next(handleError(500, error.message));
//   }
// };

const getAllCustomizeComboProductsByUserIdForWishlist = async (
  req,
  res,
  next
) => {
  try {
    const search = req.body;
    const query = {
      customizedComboId: { $ne: null },
    };

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let wishlistData = [];
    let wishlistDataForUI = [];

    const customizeComboProductIds = [];

    if (
      req.params.userId !== "unauthenticated" &&
      search &&
      search?.length === 0
    ) {
      wishlistData = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      // its not being populated so we can match to find it is in faviourate or not
      wishlistDataForUI = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      wishlistData = await wishlistSchema.populate(wishlistData, [
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

      wishlistDataForUI = filteredData;

      const wishlistDataForUIStringify = JSON.stringify(filteredData);
      const parsedData = JSON.parse(wishlistDataForUIStringify);

      for (let data of parsedData) {
        const customizedCombo = await customizedComboModelSchema.aggregate([
          {
            $match: {
              _id: new ObjectId(data.customizedComboId),
            },
          },
        ]);

        for (let rectangle of data.customizedComboRectangle) {
          const customizedComboRectangle =
            await customizeComboRectangleModalSchema.aggregate([
              {
                $match: {
                  _id: new ObjectId(rectangle.customizedComboRectangleId),
                },
              },
            ]);

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

      wishlistData = parsedData;
    }

    if (wishlistDataForUI) {
      for (let product of wishlistDataForUI) {
        customizeComboProductIds.push(new ObjectId(product?.customizedComboId));
      }
    }

    // console.log(
    //   "wishlistData__________________________",
    //   JSON.stringify(wishlistData)
    // );

    for (let wishlist of wishlistData) {
      for (let i = 0; i < wishlist?.customizedComboRectangle.length; i++) {
        const rectangle = wishlist.customizedComboRectangle[i];
        const arrays = ["Front", "SAF", "CB", "IB"];

        const combinations = {};

        for (let array of arrays) {
          const arrayCombinations = await Promise.all(
            rectangle[array].map(async (field) => {
              const parameterPositionData =
                await parameterPositionImageSchema.aggregate([
                  {
                    $match: {
                      attributeId: new ObjectId(field?.attributeId),
                      parameterId: new ObjectId(field?.parameterId),
                      positionId: new ObjectId(field?.positionId),
                    },
                  },
                ]);

              if (parameterPositionData.length > 0) {
                const populatedCombination =
                  await parameterPositionImageSchema.populate(
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
                            select:
                              "-createdAt -updatedAt -createdBy -updatedBy",
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

        wishlist.customizedComboRectangle[i] = {
          ...rectangle,
          ...combinations,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: wishlistDataForUI,
      products: wishlistData,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    console.log("error", error);
    next(handleError(500, error.message));
  }
};

const getAllSingleWishlistProductByUserId = async (req, res, next) => {
  try {
    const search = req.body;

    const query = {};

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let wishlistData = search;

    if (search?.length === 0 && req.params.userId !== "unauthenticated") {
      wishlistData = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    }

    const productCombinations = [];

    if (wishlistData?.length > 0) {
      for (let data of wishlistData) {
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
            // {
            //   path: "combinations.parameterId",
            //   select: "name profileImage",
            // },
            // {
            //   path: "combinations.attributeId",
            //   select: "Name PrintName",
            // },
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
      data: wishlistData,
      products: productCombinations,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getAllWishlistDotProductsByUserId = async (req, res, next) => {
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

    let wishlistData = search;
    let resultSP = [];
    let resultCP = [];

    if (search?.length === 0 && req.params.userId !== "unauthenticated") {
      wishlistData = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    }

    if (wishlistData?.length > 0) {
      if (search?.length > 0) {
        wishlistData = search.filter(
          (data) => data?.singleDotProductId || data?.customizeDotProductId
        );
      }

      const productIds = wishlistData.map((data) => {
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
            select: "ProductName Urlhandle Collection",
            populate: {
              path: "Collection",
              select: "title url",
            },
          },
          select: "-createdAt -updatedAt -createdBy -updatedBy ",
        },
      ]);

      // fetching dot customized products
      // Perform the second query
      const customizeDotProductFilters =
        await customizeDotProductSchema.aggregate([
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

      resultCP = await customizeDotProductSchema.populate(
        customizeDotProductFilters,
        [
          {
            path: "dotProductImageIds",
            populate: {
              path: "dots.productId",
              select: "ProductName Urlhandle Collection",
              populate: {
                path: "Collection",
                select: "title url",
              },
            },
            select: "-createdAt -updatedAt -createdBy -updatedBy ",
          },
        ]
      );
    }

    const mergedFilters = [...resultSP, ...resultCP];

    res.status(200).json({
      success: true,
      data: wishlistData,
      products: mergedFilters,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getAllWishlistCustomizedProductsByUserId = async (req, res, next) => {
  try {
    const search = req.body;

    const query = {
      customizedProductId: { $ne: null },
    };

    if (req.params.userId !== "unauthenticated") {
      query.userId = new ObjectId(req.params.userId);
    }

    let wishlistData = search;
    let wishlistDataForUI = search;

    if (search?.length === 0 && req.params.userId !== "unauthenticated") {
      wishlistData = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      // its not being populated so we can match to find it is in faviourate or not
      wishlistDataForUI = await wishlistSchema.aggregate([
        {
          $match: query,
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    }

    if (search?.length > 0 && req.params.userId === "unauthenticated") {
      wishlistDataForUI = search.filter((prodId) => prodId.customizedProductId);

      const productIds = wishlistDataForUI.map(
        (prod) => new ObjectId(prod.customizedProductId)
      );

      wishlistData = await customizedProductCombinationSchema.aggregate([
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

    const wishlists =
      search?.length === 0 && req.params.userId !== "unauthenticated"
        ? wishlistData
        : wishlistDataForUI;

    const updatedWishlist = [];

    for (let wishlist of wishlists) {
      const arrays = ["Front", "SAF", "CB", "IB"];

      const combinations = {};

      const customizeProduct = await customizedProductSchema.aggregate([
        { $match: { _id: new ObjectId(wishlist.customizedProductId) } },
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

        for (let field of wishlist[array]) {
          if (!field?.isShow) {
            continue;
          }

          const parameterPositionData =
            await parameterPositionImageSchema.aggregate([
              {
                $match: {
                  attributeId: new ObjectId(field?.attributeId),
                  parameterId: new ObjectId(field?.parameterId),
                  positionId: new ObjectId(field?.positionId),
                },
              },
            ]);

          if (parameterPositionData.length > 0) {
            const populatedCombination =
              await parameterPositionImageSchema.populate(
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
        ...wishlist,
        customizeProduct: populatedcCstomizeProduct[0],
        ...combinations,
      });
    }

    const currentSchema =
      req.params.userId === "unauthenticated"
        ? customizedProductCombinationSchema
        : wishlistSchema;

    const result = await currentSchema.populate(wishlistData, [
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

const getWishlistCustomizedProductsById = async (req, res, next) => {
  try {
    let wishlistData = await wishlistSchema.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    const updatedWishlist = [];

    if (wishlistData?.length > 0) {
      const wishlist = wishlistData[0];

      const arrays = ["Front", "SAF", "CB", "IB"];

      const combinations = {};

      const customizeProduct = await customizedProductSchema.aggregate([
        { $match: { _id: new ObjectId(wishlist.customizedProductId) } },
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

        for (let field of wishlist[array]) {
          if (!field?.isShow) {
            continue;
          }

          const parameterPositionData =
            await parameterPositionImageSchema.aggregate([
              {
                $match: {
                  attributeId: new ObjectId(field?.attributeId),
                  parameterId: new ObjectId(field?.parameterId),
                  positionId: new ObjectId(field?.positionId),
                },
              },
            ]);

          if (parameterPositionData.length > 0) {
            const populatedCombination =
              await parameterPositionImageSchema.populate(
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
        ...wishlist,
        customizeProduct: populatedcCstomizeProduct[0],
        ...combinations,
      });
    }

    const result = await wishlistSchema.populate(wishlistData, [
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

const wishlistProductCount = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.user.id);
    const count = await wishlistSchema.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $count: "wishlistCount",
      },
    ]);

    // Extracting the count from the result
    const wishlistCount = count.length > 0 ? count[0].wishlistCount : 0;

    res.status(200).json({
      success: true,
      data: wishlistCount,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// for product list purposes
const removeWishlistProduct = async (req, res, next) => {
  try {
    await wishlistSchema.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Remove From WIshlist",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getSingleProductWishlistData = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: {
          userId: new ObjectId(req.params.userId),
          singleProductId: { $ne: null },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getDotProductWishlistData = async (req, res, next) => {
  try {
    const query = {
      $or: [
        { singleDotProductId: { $ne: null } },
        { customizeDotProductId: { $ne: null } },
      ],
      userId: new ObjectId(req.params.userId),
    };

    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: query,
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCustomizeProductWishlistData = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: {
          userId: new ObjectId(req.params.userId),
          customizedProductId: { $ne: null },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getCustomizeComboProductWishlistData = async (req, res, next) => {
  try {
    const wishlistData = await wishlistSchema.aggregate([
      {
        $match: {
          userId: new ObjectId(req.params.userId),
          customizedComboId: { $ne: null },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(201).json({
      success: true,
      data: wishlistData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

module.exports = {
  addProductsToWishlist,
  addWishlist,
  getWishlist,
  getWishlistProduct,
  removeWishlistProduct,
  wishlistProductCount,
  getWishlistProductById,
  getAllSingleWishlistProductByUserId,
  getAllWishlistDotProductsByUserId,
  getAllWishlistCustomizedProductsByUserId,
  getWishlistCustomizedProductById,
  getAllCustomizeComboProductsByUserId,
  getAllCustomizeComboProductsByUserIdForWishlist,
  getSingleProductWishlistData,
  getDotProductWishlistData,
  getCustomizeProductWishlistData,
  getCustomizeComboProductWishlistData,
  getWishlistCustomizedProductsById,
  getWishlistSingleProductByWishlistId,
  getWishlistCustomizedComboProductById,
};
