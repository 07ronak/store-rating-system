import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../types";

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get all stores owned by this user
    const stores = await prisma.store.findMany({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!stores || stores.length === 0) {
      return res.status(404).json({ error: "No stores found for this owner" });
    }

    // Format each store with its ratings
    const storesData = stores.map((store) => {
      const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating =
        store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

      const ratingsWithUsers = store.ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        user: r.user,
      }));

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: Number(avgRating.toFixed(2)),
        totalRatings: store.ratings.length,
        ratings: ratingsWithUsers,
      };
    });

    res.json({
      totalStores: stores.length,
      stores: storesData,
    });
  } catch (error) {
    console.error("Get store owner dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
