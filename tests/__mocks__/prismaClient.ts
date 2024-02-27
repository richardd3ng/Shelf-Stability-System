import { User } from "@prisma/client";
import { mockToken } from "./next-auth-jwt";

export const PrismaClient = jest.fn(() => ({
    user: {
        findMany: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique : jest.fn(),
        count : jest.fn()
    },
}));
  
