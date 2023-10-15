import prisma from "./prisma";

export const connectDB = async () => {
  await prisma.$connect();
}