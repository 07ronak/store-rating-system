import { UserRole } from "@prisma/client";
import { Request } from "express";

export interface UserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
