const raiseAQuerySchema = require("../modal/raiseAQuerySchema");
const { ObjectId } = require("mongodb");
const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");

const getSingleProduct = async (req, res, next) => {
  try {
    const productId = new ObjectId(req.params.id);

    // Fetch the product data
    const productData = await raiseAQuerySchema.aggregate([
      { $match: { _id: productId } },
    ]);

    if (!productData.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const singleProduct = await raiseAQuerySchema.populate(productData, [
      { path: "architectId" },
    ]);

    const productDetails = singleProduct[0];
    const attributeIdArray = productDetails.singleProductCombinations.map(
      (item) => new ObjectId(item.attributeId)
    );
    const parameterIdArray = productDetails.singleProductCombinations.map(
      (item) => new ObjectId(item.parameterId)
    );

    // Fetch the product combinations
    const productCombinations = await singleProductCombinationSchema.aggregate([
      {
        $match: {
          singleProductId: new ObjectId(productDetails.singleProductId),
          SalePrice: { $gt: 0 },
          "combinations.attributeId": { $all: attributeIdArray },
          "combinations.parameterId": { $all: parameterIdArray },
        },
      },
    ]);

    if (!productCombinations.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product combinations not found" });
    }

    const populatedCombinations = await singleProductCombinationSchema.populate(
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
          populate: { path: "attribute" },
        },
      ]
    );

    const result = populatedCombinations[0];

    return {
      combinations: result,
      product: result.singleProductId,
      clientDetails: productDetails,
      architectDetails: productDetails.architectId,
      totalBasePrice: result.SalePrice,
    };
  } catch (error) {
    next(error);
  }
};

module.exports = { getSingleProduct };
