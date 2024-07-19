const path = require("path");
const raiseAQuerySchema = require("../modal/raiseAQuerySchema");
const fs = require("fs");
// const mail = require("../util/nodeMailer");
const { ObjectId } = require("mongodb");
// const { handleError } = require("../utils/handleError");
const customizedProductSchema = require("../modal/customizeProductModel");
const parameterPositionImageSchema = require("../modal/parameterPositionImageModal");
const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");

const getallService = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const searchTerm = search || "";
    const limits =
      parseInt(limit) || (await raiseAQuerySchema.countDocuments());
    const pageNo = parseInt(page) || 1;
    let query = {};
    if (searchTerm) {
      const numericSearch = Number(searchTerm);
      if (numericSearch) {
        query["$or"] = [
          {
            MobNumber: numericSearch,
          },
        ];
      } else {
        query["$or"] = [
          { Name: { $regex: searchTerm, $options: "i" } },
          { Email: { $regex: searchTerm, $options: "i" } },
        ];
      }
    }
    const service = await raiseAQuerySchema.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            Email: "$Email",
            MobNumber: "$MobNumber",
          },
          documents: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "documents.createdAt": -1,
        },
      },
      {
        $skip: (pageNo - 1) * limits,
      },
      {
        $limit: limits,
      },
      {
        $project: {
          _id: 1,
          firstDocument: { $arrayElemAt: ["$documents", 0] },
        },
      },
    ]);
    const totalCount = await raiseAQuerySchema.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            Email: "$Email",
            MobNumber: "$MobNumber",
          },
          documents: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "documents.createdAt": -1,
        },
      },
      {
        $project: {
          _id: 1,
          firstDocument: { $arrayElemAt: ["$documents", 0] },
        },
      },
    ]);
    res
      .status(200)
      .json({ success: true, data: service, totalCount: totalCount.length });
  } catch (error) {
    next(error);
  }
};

const getallProductByUserId = async (req, res, next) => {
  try {
    const { Email, MobNumber } = req.query;
    const service = await raiseAQuerySchema
      .find({
        $and: [{ Email: Email }, { MobNumber: MobNumber }],
      })
      .sort({ createdAt: -1 })
      .populate([
        { path: "singleProductId", populate: { path: "Collection" } },
        { path: "customizedProductId", populate: { path: "Collection" } },
      ]);

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const singleProductByRfpidForQuotation = async (req, res, next) => {
  try {
    let productData = await raiseAQuerySchema.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
    ]);

    // Check if the single product exists
    if (!productData.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const singleProduct = await raiseAQuerySchema.populate(productData, [
      {
        path: "architectId",
      },
    ]);

    const attributeIdArray = singleProduct[0].singleProductCombinations.map(
      (item) => new ObjectId(item.attributeId)
    );
    const parameterIdArray = singleProduct[0].singleProductCombinations.map(
      (item) => new ObjectId(item.parameterId)
    );

    const productId = singleProduct[0].singleProductId;

    const productCombinations = await singleProductCombinationSchema.aggregate([
      {
        $match: {
          singleProductId: new ObjectId(productId),
          SalePrice: { $gt: 0 },
          "combinations.attributeId": { $all: attributeIdArray },

          "combinations.parameterId": { $all: parameterIdArray },
        },
      },
    ]);

    const result = await singleProductCombinationSchema.populate(
      productCombinations,
      [
        {
          path: "combinations.parameterId",
          select: "name profileImage price status",
        },
        {
          path: "combinations.attributeId",
          select: "Name PrintName",
        },
        {
          path: "singleProductId",
          populate: {
            path: "attribute",
          },
        },
      ]
    );

    res
      .status(200)
      .json({ success: true, data: singleProduct, product: result });
  } catch (error) {
    next(error);
  }
};

const singleProductByRfpid = async (req, res, next) => {
  try {
    const service = await raiseAQuerySchema.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const getallProductByArchitectId = async (req, res, next) => {
  try {
    const service = await raiseAQuerySchema
      .find({
        architectId: req.user.id,
      })
      .sort({ createdAt: -1 })
      .populate([
        { path: "singleProductId", populate: { path: "Collection" } },
        { path: "customizedProductId", populate: { path: "Collection" } },
      ]);

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const postservice = async (req, res, next) => {
  try {
    const { productCombination, architectId, ...rest } = req.body;
    const saveData = architectId ? req.body : rest;
    const raiseData = await raiseAQuerySchema.create({
      ...saveData,
      ...productCombination,
    });
    // const data = await mail({
    //   name: Name,
    //   email: Email,
    //   message: Message,
    //   subject: `Request a Free Call Back ${EnquiryFor ? EnquiryFor : ""}`,
    //   phoneNo: MobNumber,
    // productName: singleProduct
    //   ? singleProduct.ProductName
    //   : customizedProduct.ProductName,
    // });
    const data = await raiseData.save();

    res.status(200).json({
      // data: data,
      success: true,
      message: "Service Request created successfully",
    });
  } catch (error) {
    console.log("check error ", error);
    next(error);
  }
};

const putservice = async (req, res, next) => {
  try {
    const data = await raiseAQuerySchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, data, message: "Discount Successfully Applied!" });
  } catch (error) {
    next(error);
  }
};

const deleteservice = async (req, res, next) => {
  try {
    await raiseAQuerySchema.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Item Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
const architectCountById = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(parseInt(currentYear) - 1, 0, 1);
    const data = await raiseAQuerySchema.aggregate([
      {
        $match: { architectId: new ObjectId(req.params.id) },
      },
    ]);

    const lastTwoYearData = await raiseAQuerySchema.aggregate([
      {
        $match: {
          architectId: new ObjectId(req.params.id),
          createdAt: { $gt: startDate },
        },
      },
      {
        $group: {
          _id: {
            $year: "$createdAt",
          },
          documentCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    let previousYearData = 0;
    let currentYearData = 0;
    let percentage = 0;

    if (lastTwoYearData?.length > 0) {
      previousYearData = parseInt(lastTwoYearData[0].documentCount)
        ? parseInt(lastTwoYearData[0].documentCount)
        : 1;

      currentYearData = parseInt(lastTwoYearData[1].documentCount);
      percentage =
        ((currentYearData - previousYearData) / previousYearData) * 100;
    }
    res.status(200).json({
      count: data && data?.length > 0 ? data?.length : 0,
      percentage: percentage.toFixed(1),
      success: true,
      message: "Item Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const servicedetails = async (req, res, next) => {
  try {
    const updatedWishlist = [];
    const existingProduct = await raiseAQuerySchema.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
    ]);

    const queryDetails = await raiseAQuerySchema.populate(existingProduct, [
      {
        path: "architectId",
        select: "-createdAt -updatedAt -createdBy -updatedBy",
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
        customizeProduct: populatedcCstomizeProduct[0],
        ...combinations,
      });
    } else {
      throw new Error("Product Not found");
    }

    res.status(200).json({
      success: true,
      data: {
        queryDetails: queryDetails && queryDetails[0] ? queryDetails[0] : {},
        updatedWishlist: updatedWishlist,
        customizeProductHeight: requestProduct?.customizeProductHeight,
        customizeProductWidth: requestProduct?.customizeProductWidth,
        customizedProductBackSelected:
          requestProduct?.customizedProductBackSelected,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getallService,
  postservice,
  putservice,
  deleteservice,
  servicedetails,
  getallProductByUserId,
  getallProductByArchitectId,
  singleProductByRfpid,
  architectCountById,
  singleProductByRfpidForQuotation,
};
