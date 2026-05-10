import { eq, and, asc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { checklists, checklistItems } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listChecklists = async (tripId) => {
  return db.query.checklists.findMany({
    where: eq(checklists.tripId, tripId),
    with: {
      items: { orderBy: (i, { asc }) => [asc(i.position)] },
    },
  });
};

export const createChecklist = async (tripId, data) => {
  const [checklist] = await db.insert(checklists).values({ tripId, ...data }).returning();
  return checklist;
};

export const updateChecklist = async (checklistId, data) => {
  const [updated] = await db
    .update(checklists)
    .set(data)
    .where(eq(checklists.id, checklistId))
    .returning();

  if (!updated) throw new AppError('Checklist not found', 404, 'NOT_FOUND');

  return updated;
};

export const deleteChecklist = async (checklistId) => {
  const deleted = await db.delete(checklists).where(eq(checklists.id, checklistId));

  if (deleted.rowCount === 0) throw new AppError('Checklist not found', 404, 'NOT_FOUND');
};

export const createItem = async (checklistId, data) => {
  const existing = await db.query.checklistItems.findMany({
    where: eq(checklistItems.checklistId, checklistId),
    columns: { position: true },
    orderBy: [asc(checklistItems.position)],
  });

  const position = existing.length > 0 ? existing[existing.length - 1].position + 1 : 0;

  const [item] = await db
    .insert(checklistItems)
    .values({ checklistId, position, ...data })
    .returning();

  return item;
};

export const updateItem = async (itemId, data) => {
  const [updated] = await db
    .update(checklistItems)
    .set(data)
    .where(eq(checklistItems.id, itemId))
    .returning();

  if (!updated) throw new AppError('Item not found', 404, 'NOT_FOUND');

  return updated;
};

export const deleteItem = async (itemId) => {
  const deleted = await db.delete(checklistItems).where(eq(checklistItems.id, itemId));

  if (deleted.rowCount === 0) throw new AppError('Item not found', 404, 'NOT_FOUND');
};

export const reorderItems = async (checklistId, items) => {
  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(checklistItems)
        .set({ position: item.position })
        .where(and(eq(checklistItems.id, item.id), eq(checklistItems.checklistId, checklistId)));
    }
  });

  return db.query.checklistItems.findMany({
    where: eq(checklistItems.checklistId, checklistId),
    orderBy: (i, { asc }) => [asc(i.position)],
  });
};
