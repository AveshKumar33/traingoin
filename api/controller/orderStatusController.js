const orderStatusSchema = require("../modal/orderStatusModal");

const { handleError } = require("../utils/handleError");

const getOrderStatus = async (req, res, next) => {
  try {
    const orderStatus = await orderStatusSchema.find();
    res.status(200).json({
      success: true,
      data: orderStatus,
      message: "Data fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const postOrderStatus = async (req, res, next) => {
  try {
    await orderStatusSchema.create({
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ...req.body,
    });
    res.status(200).json({
      success: true,
      message: "Successfully Created!",
    });
  } catch (error) {
    if (error.code === 11000) {
      next(handleError(500, "Status already Present"));
    } else {
      next(handleError(500, error.message));
    }
  }
};

const putOrderStatus = async (req, res, next) => {
  try {
    const orderStatus = await orderStatusSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: { updatedBy: req.user.id, ...req.body },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: orderStatus,
      message: "Data Updated Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getOrderStatusDetails = async (req, res, next) => {
  try {
    const orderStatus = await orderStatusSchema.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: orderStatus,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const deleteOrderStatus = async (req, res, next) => {
  try {
    await orderStatusSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Successfully Deleted",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

module.exports = {
  deleteOrderStatus,
  getOrderStatusDetails,
  putOrderStatus,
  postOrderStatus,
  getOrderStatus,
};
