import { Role, User as PrismaUser } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: Role | null
    }
  }

  interface User extends PrismaUser {
  }
}