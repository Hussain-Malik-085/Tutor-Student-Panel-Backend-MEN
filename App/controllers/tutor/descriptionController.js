
const DescriptionData = require('../../Models/teacherModels/DescriptionData');


const path = require('path');



let DescriptionReceive = async (req, res) => {
  try {
    let { Introduction, Teaching, Motivation, Headline } = req.body;
    let UserId = req.user.id;

    // Update description fields
    let DescriptionSend = await DescriptionData.findOneAndUpdate(
      { userId: UserId },
      {
        introduction: Introduction,
        teaching: Teaching,
        motivation: Motivation,
        headline: Headline,
      },
      { new: true, upsert: true }
    );
    console.log("Description Data Saved Successfully in MongoDB");

    res.json({
      status: 1,
      message: "Description Data Saved Successfully",
      data: DescriptionSend,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 0,
      message: "Error saving description",
      error: err.message,
    });
  }
};
// --------------------------------------------------------- //


// GET Description Data Controller - JWT auth required
// Controller mein ye changes karein:
const getDescriptionData = async (req, res) => {
  try {
    let userId = req.user.id;
    console.log("Fetching description for userId:", userId);

    let descriptionData = await DescriptionData.findOne({ userId: userId });

    if (!descriptionData) {
      console.log("No description data found for user:", userId);
      return res.json({
        status: 0,
        message: "Description data not found",
        data: null
      });
    }

    // Response data ko consistent banayein
    let responseData = {
      Introduction: descriptionData.introduction || "",
      Teaching: descriptionData.teaching || "",
      Motivation: descriptionData.motivation || "",
      Headline: descriptionData.headline || "",
    };

    console.log("Returning data:", responseData);

    res.json({
      status: 1,
      message: "Description data retrieved successfully",
      data: responseData
    });
    
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      status: 0,
      message: "Server error",
      error: err.message
    });
  }
};


// --------------------------------------------------------- //





module.exports = {
  DescriptionReceive,
  getDescriptionData 
};
