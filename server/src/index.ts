import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { env, isProd } from './env.js';
import { authPlugin } from './plugins/auth.js';
import { authRoutes } from './routes/auth.js';
import { campaignRoutes } from './routes/campaigns.js';
import { storybookRoutes } from './routes/storybooks.js';
import { ensureStorage } from './lib/storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../app/dist');

async function main() {
  await ensureStorage();

  const fastify = Fastify({
    logger: { level: isProd ? 'info' : 'debug' },
    trustProxy: isProd,
    bodyLimit: 2 * 1024 * 1024,
  });

  await fastify.register(authPlugin);
  await fastify.register(fastifyMultipart, {
    limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  });

  fastify.get('/api/health', async () => ({ ok: true }));
  await fastify.register(authRoutes, { prefix: '/api' });
  await fastify.register(campaignRoutes, { prefix: '/api' });
  await fastify.register(storybookRoutes, { prefix: '/api' });

  if (isProd) {
    await fastify.register(fastifyStatic, {
      root: frontendDist,
      prefix: '/',
    });

    fastify.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) {
        return reply.code(404).send({ error: 'Not found' });
      }
      return reply.sendFile('index.html');
    });
  }

  await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
