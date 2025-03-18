import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthRequest).user;
    
    if (!user || !user.id) {
      console.error("User not found in request:", user);
      return res.status(404).json({ error: "User not found!" });
    }
    
    console.log("Getting profile for user ID:", user.id);
    
    // We already have the user data from the middleware
    // Just return it directly to avoid an extra database call
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      role: user.role
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Unable to fetch user details!" });
  }
};
