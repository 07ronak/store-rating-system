import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../types";
import { validateRating } from "../utils/validation";

export const getStores = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, sortBy = "name", sortOrder = "asc" } = req.query;
    const userId = req.user?.userId;

    const where: any = {};
    if (name) where.name = { contains: name as string, mode: "insensitive" };
    if (address)
      where.address = { contains: address as string, mode: "insensitive" };

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy as string] = sortOrder === "desc" ? "desc" : "asc";
    }

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        ratings: true,
      },
    });

    // Calculate average rating and user's rating for each store
    const storesWithRating = stores.map((store) => {
      const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating =
        store.ratings.length > 0 ? totalRating / store.ratings.length : 0;
      const userRating = store.ratings.find((r) => r.userId === userId);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: Number(avgRating.toFixed(2)),
        userRating: userRating ? userRating.rating : null,
        userRatingId: userRating ? userRating.id : null,
      };
    });

    res.json({ stores: storesWithRating });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const submitRating = async (req: AuthRequest, res: Response) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user?.userId;

    // Validate rating
    const ratingError = validateRating(rating);
    if (ratingError) return res.status(400).json({ error: ratingError });

    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Check if user already rated this store
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: userId!,
          storeId,
        },
      },
    });

    if (existingRating) {
      return res
        .status(400)
        .json({
          error: "You have already rated this store. Use update instead.",
        });
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        rating,
        userId: userId!,
        storeId,
      },
    });

    res
      .status(201)
      .json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    console.error("Submit rating error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user?.userId;

    // Validate rating
    const ratingError = validateRating(rating);
    if (ratingError) return res.status(400).json({ error: ratingError });

    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    // Check if rating exists
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: userId!,
          storeId,
        },
      },
    });

    if (!existingRating) {
      return res
        .status(404)
        .json({ error: "Rating not found. Please submit a rating first." });
    }

    // Update rating
    const updatedRating = await prisma.rating.update({
      where: {
        userId_storeId: {
          userId: userId!,
          storeId,
        },
      },
      data: { rating },
    });

    res.json({ message: "Rating updated successfully", rating: updatedRating });
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
