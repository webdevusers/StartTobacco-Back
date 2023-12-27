const express = require("express");
const router = express.Router();
const seo = require("../models/seo");

const updateSeoMeta = async (objectName, key, value) => {
  try {
    // Find the existing document
    const existingSeoMeta = await seo.findOne({});

    if (!existingSeoMeta) {
      // Handle case where no document is found
      throw new Error("No existing SEO metadata found");
    }

    // Save the existing document data for reference
    const existingData = { ...existingSeoMeta.toObject() };

    // Delete the existing document
    await seo.deleteOne({});

    // Create a new document with updated values
    const newSeoMeta = new seo({
      ...existingData,
      [`${objectName}.${key}`]: value,
    });

    // Save the new document
    const updatedSeoMeta = await newSeoMeta.save();

    return updatedSeoMeta;
  } catch (error) {
    throw new Error(`Failed to update SEO metadata: ${error.toString()}`);
  }
};

router.post("/update", async (req, res) => {
  try {
    const { objectName, key, value } = req.body;
    const updatedSeoMeta = await updateSeoMeta(objectName, key, value);
    res.json(updatedSeoMeta);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
router.get("/all", async (req, res) => {
  try {
    const all = await seo.find();
    res.status(200).json(all);
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});
module.exports = router;
