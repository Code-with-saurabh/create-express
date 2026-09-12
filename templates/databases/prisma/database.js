const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Prisma connected to database');
  } catch (error) {
    logger.error({ err: error }, 'Prisma connection error');
    process.exit(1);
  }

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    logger.info('Prisma connection closed due to app termination');
    process.exit(0);
  });
};

module.exports = { prisma, connectDB };
