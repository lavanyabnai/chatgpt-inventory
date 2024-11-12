import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import {
  processingCosts,
  insertProcessingCostsSchema,
  products, 
  facilities,
  periods,
  customConstraints
} from '@/db/schema';

const patchprocessingCostsSchema = z.object({
  facilityId: z.number().int().positive().optional(),
  productId: z.number().int().positive().optional(),
  type: z.string().optional(),
  units: z.string().optional(),
  cost: z.number().optional(),
  currency: z.string().optional(),
  timePeriodId: z.number().int().positive().optional(),
  
});
async function fetchEntityMap(table: any, names: string[]) {
  const entities = await db
    .select({ id: table.id, name: table.name })
    .from(table)
    .where(sql`${table.name} IN ${names}`);

  return new Map(entities.map((entity) => [entity.name, entity.id]));
}

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        facilityId: z.number().optional(),
        productId: z.number().optional(),
        timePeriodId: z.number().optional()
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { facilityId, productId, timePeriodId } = c.req.valid('query');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .select({
          id: processingCosts.id,
          facilityId: processingCosts.facilityId,
          facilityName: facilities.name,
          productId: processingCosts.productId,
          productName: products.name,
          type: processingCosts.type,
          units: processingCosts.units,
          cost: processingCosts.cost,
          currency: processingCosts.currency,
          timePeriodId: processingCosts.timePeriodId,
          timePeriodName: periods.name
        })
        .from(processingCosts)
        .leftJoin(facilities, eq(processingCosts.facilityId, facilities.id))
        .leftJoin(products, eq(processingCosts.productId, products.id))
        .leftJoin(periods, eq(processingCosts.timePeriodId, periods.id))
        .where(
          and(
            facilityId ? eq(processingCosts.facilityId, facilityId) : undefined,
            productId ? eq(processingCosts.productId, productId) : undefined,
            timePeriodId ? eq(processingCosts.timePeriodId, timePeriodId) : undefined
          )
        )
        .orderBy(desc(processingCosts.id));

      return c.json({ data });
    }
  )
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
        .from(processingCosts)
        .where(eq(processingCosts.id, parseInt(id)));

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertProcessingCostsSchema),
    async (c) => {
      try {
        const auth = getAuth(c);
        const values = c.req.valid('json');

        if (!auth?.userId) {
          return c.json({ error: 'Unauthorized' }, 401);
        }

        console.log('Inserting values:', JSON.stringify(values, null, 2));

        let data;
        try {
          [data] = await db
            .insert(processingCosts)
            .values(values)
            .returning();
        } catch (dbError: any) {
          console.error('Database insertion error:', dbError);
          console.error('Error stack:', dbError.stack);
          return c.json(
            {
              error: 'Database insertion failed',
              details: dbError.message,
              stack: dbError.stack
            },
            500
          );
        }

        if (!data) {
          console.error('No data returned after insertion');
          return c.json({ error: 'Insertion failed - no data returned' }, 500);
        }

        console.log('Inserted data:', JSON.stringify(data, null, 2));

        return c.json({ data });
      } catch (error: any) {
        console.error('POST Error:', error);
        console.error('Error stack:', error.stack);
        if (error instanceof z.ZodError) {
          return c.json(
            { error: 'Validation error', details: error.errors },
            400
          );
        }
        return c.json({ error: error.message, stack: error.stack }, 500);
      }
    }
  )
  .post(
    '/bulk-create',
    clerkMiddleware(),
    zValidator('json', z.array(insertProcessingCostsSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
        await db.delete(processingCosts);
      const data = await db.insert(processingCosts).values(values).returning();

      return c.json({ data });
    }
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.number()) // Change from z.string() to z.number()
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { ids } = c.req.valid('json'); // Destructure ids directly

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      try {
        const data = await db
          .delete(processingCosts)
          .where(inArray(processingCosts.id, ids)) // Use ids directly
          .returning({ id: processingCosts.id });

        return c.json({ data });
      } catch (error) {
        console.error('Bulk delete error:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
      }
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
    zValidator('json', patchprocessingCostsSchema),
    async (c) => {
      try {
        const auth = getAuth(c);
        const { id } = c.req.valid('param');
        const values = c.req.valid('json');

        if (!id) {
          return c.json({ error: 'Missing id' }, 400);
        }

        if (!auth?.userId) {
          return c.json({ error: 'Unauthorized' }, 401);
        }

        // Remove undefined values from the update
        const updateValues = Object.fromEntries(
          Object.entries(values).filter(([_, v]) => v !== undefined)
        );

        // Handle cost separately to avoid type issues
        if (updateValues.cost !== undefined) {
          updateValues.cost = updateValues.cost.toString();
        }

        const [data] = await db
          .update(processingCosts)
          .set(updateValues)
          .where(eq(processingCosts.id, Number(id)))
          .returning();

        if (!data) {
          return c.json({ error: 'Not found' }, 404);
        }

        return c.json({ data });
      } catch (error: any) {
        console.error('PATCH Error:', error);
        return c.json({ 
          error: 'Update failed', 
          details: error.message,
          stack: error.stack 
        }, 500);
      }
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional()
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .delete(processingCosts)
        .where(eq(processingCosts.id, Number(id)))
        .returning({
          id: processingCosts.id
        });

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
