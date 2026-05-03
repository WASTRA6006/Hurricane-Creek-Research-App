import { Router } from "express";
import { adminAuthMiddleware } from "./auth.js";
import { updatePhotoStatus } from "../../db/queries.js";
import db from "../../db/connection.js";

const router = Router();

router.use(adminAuthMiddleware);

// GET paginated photos
router.get('/photos', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;
        const offset = (page - 1) * limit;

        // Get filter parameters from query string
        const statusFilter = req.query.status as string;
        const zonesFilter = req.query.zones as string;
        const categoriesFilter = req.query.categories as string;

        // Build WHERE conditions
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        // Status filter
        if (statusFilter) {
            const statuses = statusFilter.split(',');
            conditions.push(`photos.status = ANY($${paramIndex})`);
            params.push(statuses);
            paramIndex++;
        }

        // Zone filter
        if (zonesFilter) {
            const zones = zonesFilter.split(',').map(Number);
            conditions.push(`photos.zone_id = ANY($${paramIndex})`);
            params.push(zones);
            paramIndex++;
        }

        // Category filter
        if (categoriesFilter) {
            const categories = categoriesFilter.split(',');
            conditions.push(`photos.category = ANY($${paramIndex})`);
            params.push(categories);
            paramIndex++;
        }

        // Search filter
        const searchQuery = req.query.search as string;
        if (searchQuery && searchQuery.trim()) {
        conditions.push(`(users.name ILIKE $${paramIndex} OR photos.notes ILIKE $${paramIndex})`);
        params.push(`%${searchQuery}%`);
        paramIndex++;
        }

        const whereClause = conditions.length > 0 
            ? 'WHERE ' + conditions.join(' AND ') 
            : '';

        // Get total count with filters
        const countQuery = `SELECT COUNT(*) FROM photos LEFT JOIN users ON photos.user_id = users.id ${whereClause}`;
        const countResult = await db.query(countQuery, params);
        const totalPhotos = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalPhotos / limit);

        // Get paginated photos with filters
        const photosQuery = `
            SELECT 
                photos.*,
                users.name as uploader_name
            FROM photos
            LEFT JOIN users ON photos.user_id = users.id
            ${whereClause}
            ORDER BY photos.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        
        params.push(limit, offset);
        const photosResult = await db.query(photosQuery, params);

        res.json({
            photos: photosResult.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalPhotos: totalPhotos,
                photosPerPage: limit
            }
        });
    } catch (error) {
        console.error("Error fetching photos:", error);
        res.status(500).json({ message: "Failed to fetch photos" });
    }
});

// PATCH photo status
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