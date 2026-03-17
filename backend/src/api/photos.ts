import { Router } from "express";
import { Photo } from "../types/photo.js";
import { getAllPhotos } from "../db/queries.js";
import { getPhotoById } from "../db/queries.js";
import { createPhoto } from "../db/queries.js";
import { adminAuthMiddleware } from './admin/auth.js';
import cloudinary from "../config/cloudinary.js";

const router = Router();

router.get("/photos", adminAuthMiddleware, async (req, res) => {
    console.log("getAllPhotos endpoint hit");
    try {
      const photos = await getAllPhotos(50, 0);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
});

router.get("/photos/:id", adminAuthMiddleware, async (req, res) => {
    console.log("getPhotoById endpoint hit with id:", req.params.id);
    try {
      const id = parseInt(req.params.id);
      const photo = await getPhotoById(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      console.error("Error fetching photo:", error);
      res.status(500).json({ message: "Failed to fetch photo" });
    }
});

router.post("/photos", async (req, res) => {
    console.log("createPhoto endpoint hit with body:", req.body);
    try {
      //Extract image data and other photo data from the request body
      const {image_data, ...photoData} = req.body;
      //Validate size
      const sizeInBytes = (image_data.length *3) / 4; // Base64 to bytes
      const sizeInMB = sizeInBytes / (1024 * 1024);
      if (sizeInMB > 10) {
        return res.status(400).json({ message: "Image size exceeds 10MB limit" });
      }
      //Upload the image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image_data, {
        folder: "hurricane-creek-photos",
      });
      //Create photo with Cloudinary URL
      const photo = await createPhoto({
        ...photoData,
        image_url: uploadResult.secure_url,
      });
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error creating photo:", error);
      res.status(500).json({ message: "Failed to create photo" });
    }
});

export default router;