import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';

const createSchema = z.object({
  name: z.string().min(1).max(200),
  caseFileNumber: z.string().max(64).optional(),
  data: z.unknown().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  caseFileNumber: z.string().max(64).nullable().optional(),
  data: z.unknown().optional(),
});

const idParam = z.object({ id: z.string().min(1) });

export async function campaignRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.requireAuth);

  fastify.get('/campaigns', async (req) => {
    const campaigns = await prisma.campaign.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        caseFileNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { campaigns };
  });

  fastify.post('/campaigns', async (req, reply) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid campaign payload' });
    }
    const campaign = await prisma.campaign.create({
      data: {
        userId: req.userId,
        name: parsed.data.name,
        caseFileNumber: parsed.data.caseFileNumber,
        data: (parsed.data.data ?? {}) as object,
      },
    });
    return reply.code(201).send({ campaign });
  });

  fastify.get('/campaigns/:id', async (req, reply) => {
    const params = idParam.safeParse(req.params);
    if (!params.success) return reply.code(400).send({ error: 'Invalid id' });

    const campaign = await prisma.campaign.findFirst({
      where: { id: params.data.id, userId: req.userId },
      include: {
        storybooks: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, sizeBytes: true, createdAt: true },
        },
      },
    });
    if (!campaign) return reply.code(404).send({ error: 'Campaign not found' });
    return { campaign };
  });

  fastify.put('/campaigns/:id', async (req, reply) => {
    const params = idParam.safeParse(req.params);
    if (!params.success) return reply.code(400).send({ error: 'Invalid id' });

    const body = updateSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: 'Invalid payload' });

    const owned = await prisma.campaign.findFirst({
      where: { id: params.data.id, userId: req.userId },
      select: { id: true },
    });
    if (!owned) return reply.code(404).send({ error: 'Campaign not found' });

    const campaign = await prisma.campaign.update({
      where: { id: params.data.id },
      data: {
        ...(body.data.name !== undefined && { name: body.data.name }),
        ...(body.data.caseFileNumber !== undefined && {
          caseFileNumber: body.data.caseFileNumber,
        }),
        ...(body.data.data !== undefined && { data: body.data.data as object }),
      },
    });
    return { campaign };
  });

  fastify.delete('/campaigns/:id', async (req, reply) => {
    const params = idParam.safeParse(req.params);
    if (!params.success) return reply.code(400).send({ error: 'Invalid id' });

    const result = await prisma.campaign.deleteMany({
      where: { id: params.data.id, userId: req.userId },
    });
    if (result.count === 0) return reply.code(404).send({ error: 'Campaign not found' });
    return { ok: true };
  });
}
