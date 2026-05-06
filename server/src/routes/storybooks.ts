import type { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { z } from 'zod';
import { prisma } from '../db.js';
import { storybookPath } from '../lib/storage.js';

const MAX_PDF_BYTES = 50 * 1024 * 1024;
const idParam = z.object({ id: z.string().min(1) });

export async function storybookRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.requireAuth);

  fastify.post('/campaigns/:id/storybooks', async (req, reply) => {
    const params = idParam.safeParse(req.params);
    if (!params.success) return reply.code(400).send({ error: 'Invalid id' });

    const owned = await prisma.campaign.findFirst({
      where: { id: params.data.id, userId: req.userId },
      select: { id: true },
    });
    if (!owned) return reply.code(404).send({ error: 'Campaign not found' });

    const file = await req.file();
    if (!file) return reply.code(400).send({ error: 'Missing file' });
    if (file.mimetype !== 'application/pdf') {
      return reply.code(415).send({ error: 'Only application/pdf accepted' });
    }

    const buffer = await file.toBuffer();
    if (buffer.length > MAX_PDF_BYTES) {
      return reply.code(413).send({ error: 'File exceeds 50MB limit' });
    }

    const titleField = file.fields.title;
    const title =
      titleField && 'value' in titleField && typeof titleField.value === 'string'
        ? titleField.value.slice(0, 200)
        : file.filename || 'Storybook';

    const storybook = await prisma.storybook.create({
      data: {
        campaignId: params.data.id,
        title,
        filePath: '',
        sizeBytes: buffer.length,
      },
    });

    const dest = storybookPath(storybook.id);
    await writeFile(dest, buffer);
    const updated = await prisma.storybook.update({
      where: { id: storybook.id },
      data: { filePath: dest },
      select: { id: true, title: true, sizeBytes: true, createdAt: true },
    });

    return reply.code(201).send({ storybook: updated });
  });

  fastify.get('/storybooks/:id', async (req, reply) => {
    const params = idParam.safeParse(req.params);
    if (!params.success) return reply.code(400).send({ error: 'Invalid id' });

    const storybook = await prisma.storybook.findFirst({
      where: { id: params.data.id, campaign: { userId: req.userId } },
    });
    if (!storybook) return reply.code(404).send({ error: 'Storybook not found' });

    reply
      .header('Content-Type', 'application/pdf')
      .header(
        'Content-Disposition',
        `inline; filename="${storybook.title.replace(/[^\w. -]/g, '_')}.pdf"`,
      );
    return reply.send(createReadStream(storybook.filePath));
  });

  fastify.delete('/storybooks/:id', async (req, reply) => {
    const params = idParam.safeParse(req.params);
    if (!params.success) return reply.code(400).send({ error: 'Invalid id' });

    const storybook = await prisma.storybook.findFirst({
      where: { id: params.data.id, campaign: { userId: req.userId } },
    });
    if (!storybook) return reply.code(404).send({ error: 'Storybook not found' });

    await prisma.storybook.delete({ where: { id: storybook.id } });
    await unlink(storybook.filePath).catch(() => {});
    return { ok: true };
  });
}
