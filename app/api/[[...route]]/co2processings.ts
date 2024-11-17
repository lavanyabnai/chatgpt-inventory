import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { eq, inArray, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import {
  co2Processing,
  facilities,
  products,
  periods,
  insertCo2ProcessingSchema
} from '@/db/schema';

const patchCo2ProcessingSchema = z.object({
  facilityId: z.number(),
  productId: z.number(),
  processingType: z.string(),
  units: z.string(),
  co2Produced: z.number(),
  timePeriodId: z.number(),
  co2CalculationFormula: z.string().optional()
});

const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await db
      .select({
        id: co2Processing.id,
        facilityId: co2Processing.facilityId,
        facilityName: facilities.name,
        productId: co2Processing.productId,
        productName: products.name,
        processingType: co2Processing.processingType,
        units: co2Processing.units,
        co2Produced: co2Processing.co2Produced,
        timePeriodId: co2Processing.timePeriodId,
        timePeriod: periods.name
      })
      .from(co2Processing)
      .innerJoin(facilities, eq(co2Processing.facilityId, facilities.id))
      .innerJoin(periods, eq(co2Processing.timePeriodId, periods.id))
      .innerJoin(products, eq(co2Processing.productId, products.id));

    return c.json({ data });
  })
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string()
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .select()
        .from(co2Processing)
        .where(eq(co2Processing.id, parseInt(id)));

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator(
      'json',
      insertCo2ProcessingSchema.omit({
        id: true
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .insert(co2Processing)
        .values({
          ...values
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    '/bulk-create',
    clerkMiddleware(),
    zValidator(
      'json',
      z.array(
        insertCo2ProcessingSchema.omit({
          id: true
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .insert(co2Processing)
        .values(
          values.map((value) => ({
            ...value
          }))
        )
        .returning();
      return c.json({ data });
    }
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.number())
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { ids } = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      try {
        const data = await db
          .delete(co2Processing)
          .where(inArray(co2Processing.id, ids))
          .returning({ id: co2Processing.id });

        return c.json({ data });
      } catch (error) {
        console.error('Bulk delete error:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
      }
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string()
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .delete(co2Processing)
        .where(eq(co2Processing.id, parseInt(id)))
        .returning();

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string()
      })
    ),
    zValidator('json', patchCo2ProcessingSchema),
    async (c) => {
      try {
        const auth = getAuth(c);
        const { id } = c.req.valid('param');
        const values = c.req.valid('json');

        if (!auth?.userId) {
          throw new Error('Unauthorized');
        }

        const [data] = await db
          .update(co2Processing)
          .set(values)
          .where(eq(co2Processing.id, parseInt(id)))
          .returning();

        if (!data) {
          throw new Error('Not found');
        }

        return c.json({ data });
      } catch (error) {
        console.error('❌ PATCH ERROR:', error);
        if (error instanceof z.ZodError) {
          console.error('Validation error:', error.errors);
          return c.json(
            { error: 'Validation error', details: error.errors },
            400
          );
        }
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        return c.json(
          { error: errorMessage },
          errorMessage === 'Unauthorized' ? 401 : 404
        );
      }
    }
  );

export default app;
