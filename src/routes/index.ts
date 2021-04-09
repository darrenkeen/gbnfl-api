import { Router } from 'express';
import trophyRoutes from './trophies';
import playerRoutes from './players';
import gameRoutes from './games';
import dataRoutes from './data';
import cacheRoutes from './cache';
import { registerMiddleware } from '../config/middleware';

export function initRestRoutes(router: Router): void {
  const prefix: string = '/api/v1';
  registerMiddleware(router);
  router.use(`${prefix}/trophies`, trophyRoutes);
  router.use(`${prefix}/players`, playerRoutes);
  router.use(`${prefix}/games`, gameRoutes);
  router.use(`${prefix}/data`, dataRoutes);
  router.use(`${prefix}/cache`, cacheRoutes);
}
