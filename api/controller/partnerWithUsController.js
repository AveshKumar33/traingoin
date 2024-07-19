const partnerWithUsSchema = require("../modal/partnerWithUsModal");
const { handleError } = require("../utils/handleError");
const fs = require("fs");

//Get User
const getPwus = async (req, res, next) => {
  try {
    const partnerWithUs = await partnerWithUsSchema.find();
    res.status(200).json({
      success: true,
      data: partnerWithUs,
      message: "Data fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

//Post User
const postPwus = async (req, res, next) => {
  try {
    const image = req.file.filename;
    const partnerWithUsdata = new partnerWithUsSchema({
      pwusImage: image,
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });
    const partnerWithUs = await partnerWithUsdata.save();
    res.status(200).json({
      success: true,
      data: partnerWithUs,
      message: "partnerWithUs Created Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

//Put User
const putPwus = async (req, res, next) => {
  try {
    const pwusUpdate = {};
    if (req.file) {
      pwusUpdate.pwusImage = req.file.filename;
      pwusUpdate.updatedBy = req.user.id;
    }
    const pwUsUpdated = await partnerWithUsSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: pwusUpdate,
      }
    );

    if (req.file) {
      const imgpath = `images/clientImages/${pwUsUpdated.pwusImage}`;
      if (fs.existsSync(imgpath)) {
        fs.unlinkSync(imgpath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Data Updated Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

//Get User Details

const getPwusDetails = async (req, res, next) => {
  try {
    const pwus = await partnerWithUsSchema.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: pwus,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
const getContactUsDetails = async (req, res, next) => {
  try {
    const contactUsImage = await partnerWithUsSchema.findOne({
      status: "contactUsImage",
    });
    const contactUsVideo = await partnerWithUsSchema.findOne({
      status: "contactUsVideo",
    });

    res.status(200).json({
      success: true,
      data: { contactUsVideo: contactUsVideo, contactUsImage: contactUsImage },
      message: "contactUs Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

//Delete deletePwus
const deletePwus = async (req, res, next) => {
  try {
    const partnerWithUs = await partnerWithUsSchema.findByIdAndDelete(
      req.params.id
    );
    if (partnerWithUs) {
      const imgpath = `images/clientImages/${partnerWithUs.pwusImage}`;
      if (fs.existsSync(imgpath)) {
        fs.unlinkSync(imgpath);
      }
    }
    res.status(200).json({
      success: true,
      message: "users Deleted Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

module.exports = {
  deletePwus,
  getPwusDetails,
  putPwus,
  postPwus,
  getContactUsDetails,
  getPwus,
};
