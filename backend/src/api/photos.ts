import { Router } from "express";
import { Photo } from "../types/photo.js";
import { getAllPhotos } from "../db/queries.js";
import { getPhotoById } from "../db/queries.js";
import { createPhoto } from "../db/queries.js";
import { adminAuthMiddleware } from './admin/auth.js';

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
      const photo = await createPhoto(req.body);
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error creating photo:", error);
      res.status(500).json({ message: "Failed to create photo" });
    }
});

export default router;