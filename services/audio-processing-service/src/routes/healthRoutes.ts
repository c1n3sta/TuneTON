import { Router } from 'express';
import healthController from '../controllers/healthController';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the service and its dependencies
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   description: Service uptime in seconds
 *                 message:
 *                   type: string
 *                   description: Health status message
 *                 timestamp:
 *                   type: number
 *                   description: Current timestamp
 *                 checks:
 *                   type: object
 *                   properties:
 *                     redis:
 *                       type: string
 *                       enum: [healthy, unhealthy, pending]
 *                       description: Redis connection status
 *                     storage:
 *                       type: string
 *                       enum: [healthy, unhealthy, pending]
 *                       description: Storage access status
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', healthController.checkHealth);

/**
 * @swagger
 * /health/ping:
 *   get:
 *     summary: Simple ping endpoint
 *     description: Returns a simple status message for load balancer health checks
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: number
 *                   example: 1620000000000
 */
router.get('/ping', healthController.ping);

export default router;
