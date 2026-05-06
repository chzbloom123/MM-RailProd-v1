import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { env, isProd } from '../env.js';

export const COOKIE_NAME = 'mmc_token';
const TOKEN_TTL = '7d';

declare module 'fastify' {
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    issueAuthCookie: (reply: FastifyReply, userId: string) => void;
    clearAuthCookie: (reply: FastifyReply) => void;
  }
  interface FastifyRequest {
    userId: string;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string };
    user: { sub: string };
  }
}

export const authPlugin = fp(async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: COOKIE_NAME, signed: false },
    sign: { expiresIn: TOKEN_TTL },
  });

  fastify.decorateRequest('userId', '');

  fastify.decorate('requireAuth', async function (req: FastifyRequest, reply: FastifyReply) {
    try {
      const decoded = await req.jwtVerify<{ sub: string }>({ onlyCookie: true });
      req.userId = decoded.sub;
    } catch {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  fastify.decorate('issueAuthCookie', function (reply: FastifyReply, userId: string) {
    const token = fastify.jwt.sign({ sub: userId });
    reply.setCookie(COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      domain: env.COOKIE_DOMAIN || undefined,
    });
  });

  fastify.decorate('clearAuthCookie', function (reply: FastifyReply) {
    reply.clearCookie(COOKIE_NAME, { path: '/', domain: env.COOKIE_DOMAIN || undefined });
  });
});
