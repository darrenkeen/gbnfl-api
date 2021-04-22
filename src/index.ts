import 'reflect-metadata';
import 'source-map-support/register';
import 'module-alias/register';
import dotenv from 'dotenv';
import { Connection, createConnection } from 'typeorm';
import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import path from 'path';

import { logger } from './config/logger';
import { Server } from './config/server';

dotenv.config();

// Startup
(async function main() {
  try {
    logger.info('Initializing ORM connection...');
    const connection: Connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      schema: 'public',
      entities: [path.join(__dirname, './entities/*')],
      migrations: [path.join(__dirname, './migrations/*')],
    });

    await connection.runMigrations();

    // Init express server
    const app: express.Application = new Server().app;
    const server: HttpServer = createServer(app);

    // Start express server
    server.listen(process.env.PORT);

    server.on('listening', () => {
      logger.info(
        `gbnfl node server is listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
      );
    });

    server.on('close', () => {
      connection.close();
      logger.info('gbnfl node server closed');
    });
  } catch (err) {
    logger.error(err.stack);
  }
})();
