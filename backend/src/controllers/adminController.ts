import { Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { AuthRequest } from "../types";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from "../utils/validation";
import { UserRole } from "@prisma/client";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate inputs
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    if (!role || !["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role as UserRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createStore = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Validate inputs
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    if (email) {
      const emailError = validateEmail(email);
      if (emailError) return res.status(400).json({ error: emailError });
    }

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    // If ownerId is provided, validate the owner
    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner) {
        return res.status(404).json({ error: "Owner not found" });
      }
      if (owner.role !== "STORE_OWNER") {
        return res
          .status(400)
          .json({ error: "User must have STORE_OWNER role" });
      }
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        name,
        email: email || null,
        address,
        ownerId: ownerId || null,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStores = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const where: any = {};
    if (name) where.name = { contains: name as string, mode: "insensitive" };
    if (email) where.email = { contains: email as string, mode: "insensitive" };
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
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Calculate average rating for each store
    const storesWithRating = stores.map((store) => {
      const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating =
        store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: Number(avgRating.toFixed(2)),
        totalRatings: store.ratings.length,
        owner: store.owner,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      };
    });

    res.json({ stores: storesWithRating });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Build where clause for filtering
    const where: any = {};
    if (name) where.name = { contains: name as string, mode: "insensitive" };
    if (email) where.email = { contains: email as string, mode: "insensitive" };
    if (address)
      where.address = { contains: address as string, mode: "insensitive" };
    if (role) where.role = role as UserRole;

    // Build orderBy clause for sorting
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy as string] = sortOrder === "desc" ? "desc" : "asc";
    }

    // Fetch users with their stores (if STORE_OWNER)
    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        stores: {
          include: {
            ratings: true,
          },
        },
      },
    });

    // Format users with store ratings for STORE_OWNER
    const formattedUsers = users.map((user) => {
      const userData: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // If user is a store owner and has stores, include them with ratings
      if (user.role === "STORE_OWNER" && user.stores.length > 0) {
        userData.stores = user.stores.map((store) => {
          const totalRating = store.ratings.reduce(
            (sum, r) => sum + r.rating,
            0
          );
          const avgRating =
            store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

          return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            rating: Number(avgRating.toFixed(2)),
            totalRatings: store.ratings.length,
          };
        });
      }

      return userData;
    });

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
