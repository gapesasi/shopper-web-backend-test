import { PrismaClient } from '@prisma/client';
import app from './config/app';

const prismaClientSingleton = () => {
  return new PrismaClient()
  
}
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (app.environment !== 'production') globalThis.prismaGlobal = prisma