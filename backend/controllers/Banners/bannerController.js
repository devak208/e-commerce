const db = require('../../config/db');
const path = require('path');
const fs = require("fs"); 

exports.getAllBanners = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banners');
    
    // Append full image URL for response
    const banners = rows.map(banner => ({
      ...banner,
      image: banner.image ? `${req.protocol}://${req.get('host')}/uploads/${banner.image}` : null
    }));

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { title, link } = req.body;
  let image = null;

  // If a new file was uploaded, use its filename
  if (req.file) {
    image = req.file.filename;
  } 
  // Otherwise, if an image URL was sent in the body, extract the filename.
  else if (req.body.image) {
    const parts = req.body.image.split('/');
    image = parts[parts.length - 1];
  }

  try {
    const [result] = await db.query(
      'INSERT INTO banners (title, link, image) VALUES (?, ?, ?)',
      [title, link, image]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      link,
      image: image ? `${req.protocol}://${req.get('host')}/uploads/${image}` : null
    });
  } catch (error) {
    console.error("Error in createBanner:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.deleteBanner = async (req, res) => {
  try {
    // Fetch the banner image filename before deleting
    const [banners] = await db.query("SELECT image FROM banners WHERE id = ?", [req.params.id]);

    if (banners.length === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete the image file from uploads
    if (banners[0].image) {
      const imagePath = path.join(__dirname, "../uploads", banners[0].image);
      // Only delete if we're not keeping this image for another banner
      const keepImage = req.query.keepImage === "true";

      if (!keepImage && fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }
    }

    // Delete the banner record from the database
    const [result] = await db.query("DELETE FROM banners WHERE id = ?", [req.params.id]);
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateBanner = async (req, res) => {
  console.log("Update request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { title, link } = req.body;
  let image = null;

  // If a new file is uploaded, use its filename.
  if (req.file) {
    image = req.file.filename;

    // Optionally: Delete the old image file if it exists.
    // (Fetch the current banner first and delete its file.)
    const [oldBannerRows] = await db.query("SELECT image FROM banners WHERE id = ?", [req.params.id]);
    if (oldBannerRows.length && oldBannerRows[0].image) {
      const oldImagePath = path.join(__dirname, "../uploads", oldBannerRows[0].image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
    }
  } 
  // Otherwise, if no new file, extract the filename from the image URL sent in the body.
  else if (req.body.image) {
    const parts = req.body.image.split('/');
    image = parts[parts.length - 1];
  }

  try {
    const [result] = await db.query(
      'UPDATE banners SET title = ?, link = ?, image = ? WHERE id = ?',
      [title, link, image, req.params.id]
    );

    res.status(200).json({
      message: 'Banner updated successfully',
      banner: {
        id: req.params.id,
        title,
        link,
        image: image ? `${req.protocol}://${req.get('host')}/uploads/${image}` : null
      }
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: error.message });
  }
};
