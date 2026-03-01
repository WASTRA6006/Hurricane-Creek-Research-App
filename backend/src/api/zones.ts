import { Router } from "express";
import { Zone } from "../types/zone.js";
import { getZones } from "../db/queries.js"

const router = Router();

router.get("/zones", async (req, res) => {
  console.log("getZones endpoint hit");
  try {
    const zones = await getZones();
    res.json(zones);
  } catch (error) {
    console.error("Error fetching zones:", error);
    res.status(500).json({ message: "Failed to fetch zones" });
  }
});

export default router;