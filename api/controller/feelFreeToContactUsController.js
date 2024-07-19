const feelFreeToContactUsSchema = require("../modal/feelFreeToContactUsModel");

const getallFeelFreeToContactUs = async (req, res, next) => {
  try {
    const feelFreeToContactUs = await feelFreeToContactUsSchema
      .find()
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feelFreeToContactUs });
  } catch (error) {
    next(error);
  }
};

const createFeelFreeToContactUs = async (req, res, next) => {
  try {
    const feelFreeToContactUs = await feelFreeToContactUsSchema.create({
      ...req.body,
    });
    const data = await feelFreeToContactUs.save();
    res.status(200).json({
      data: data,
      success: true,
      message: "Feel Free To Contact Us Request created successfully",
    });
  } catch (error) {
    console.log("check error ", error);
    next(error);
  }
};

module.exports = {
  getallFeelFreeToContactUs,
  createFeelFreeToContactUs,
};
