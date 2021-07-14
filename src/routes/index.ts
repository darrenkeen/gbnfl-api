import { Router } from 'express';
import trophyRoutes from './trophies';
import playerRoutes from './players';
import dataRoutes from './data';
import cacheRoutes from './cache';
import matchesRoutes from './matches';
import lifetimeRoutes from './lifetime';
import weeklyRoutes from './weekly';
import seasonRoutes from './season';
import userRoutes from './user';
import overallGoalRoutes from './overallGoal';
import achievementRoutes from './achievements';
import { registerMiddleware } from '../config/middleware';

export function initRestRoutes(router: Router): void {
  const prefix: string = '/api/v1';
  registerMiddleware(router);
  router.use(`${prefix}/trophies`, trophyRoutes);
  router.use(`${prefix}/players`, playerRoutes);
  router.use(`${prefix}/data`, dataRoutes);
  router.use(`${prefix}/cache`, cacheRoutes);
  router.use(`${prefix}/matches`, matchesRoutes);
  router.use(`${prefix}/lifetime`, lifetimeRoutes);
  router.use(`${prefix}/weekly`, weeklyRoutes);
  router.use(`${prefix}/season`, seasonRoutes);
  router.use(`${prefix}/user`, userRoutes);
  router.use(`${prefix}/achievements`, achievementRoutes);
  router.use(`${prefix}/overall-goal`, overallGoalRoutes);
}
