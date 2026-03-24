import { Router } from "express";
import { Zone } from "../../types/zone.js";
import { Photo } from "../../types/photo.js";
import { adminAuthMiddleware } from "./auth.js";
import { updatePhotoStatus } from "../../db/queries.js";

const router = Router();

router.use(adminAuthMiddleware);

router.patch('/photos/:id/status', async (req, res) => {
    console.log("adminPhotoPatch endpoint hit with body:", req.body);
        try {
            const photoId = parseInt(req.params.id);
            const { status } = req.body;
            const validStatuses = ['active', 'hidden', 'flagged'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status. Must be: active, hidden, or flagged"});
            }
            const photoStatus = await updatePhotoStatus(photoId, status);
            if (!photoStatus) {
                return res.status(404).json({ message: "Photo not found" });
            }
            res.status(200).json(photoStatus);
        } catch (error) {
            console.error("Error patching photo status:", error);
            res.status(500).json({ message: "Failed to patch photo status" });
        }
});

export default router;
