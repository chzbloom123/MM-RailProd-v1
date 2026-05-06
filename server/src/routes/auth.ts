import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { hashPassword, verifyPassword } from '../lib/passwords.js';

const credentialsSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(200),
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', async (req, reply) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid email or password (min 8 chars)' });
    }
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.code(409).send({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });

    fastify.issueAuthCookie(reply, user.id);
    return reply.code(201).send({ user });
  });

  fastify.post('/auth/login', async (req, reply) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid credentials' });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    fastify.issueAuthCookie(reply, user.id);
    return reply.send({ user: { id: user.id, email: user.email, createdAt: user.createdAt } });
  });

  fastify.post('/auth/logout', async (_req, reply) => {
    fastify.clearAuthCookie(reply);
    return reply.send({ ok: true });
  });

  fastify.get('/auth/me', { preHandler: fastify.requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) return reply.code(404).send({ error: 'User not found' });
    return { user };
  });
}
