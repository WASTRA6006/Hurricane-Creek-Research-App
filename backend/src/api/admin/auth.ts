import { Request, Response, NextFunction } from 'express';
import { getUserRoleByEmail } from '../../db/queries.js';

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.get("x-admin-email");
  
  if (!email) {
    return res.status(401).json({ message: "Email required" });
  }
  
  try {
    const role = await getUserRoleByEmail(email);
    
    if (role === 'admin') {
      next(); // Allow request to continue
    } else {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
  } catch (error) {
    console.error("Error in admin auth middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};