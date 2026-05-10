import { eq, and } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { comments } from '../../db/schema/index.js';
import { AppError } from '../../utils/AppError.js';

export const listComments = async (tripId, parentType, parentId) => {
  return db.query.comments.findMany({
    where: and(
      eq(comments.tripId, tripId),
      eq(comments.parentType, parentType),
      eq(comments.parentId, parentId),
    ),
    with: {
      author: { columns: { id: true, name: true, email: true } },
    },
    orderBy: (c, { asc }) => [asc(c.createdAt)],
  });
};

export const createComment = async (tripId, authorId, { parentType, parentId, body }) => {
  const [comment] = await db
    .insert(comments)
    .values({ tripId, authorId, parentType, parentId, body })
    .returning();

  return comment;
};

export const deleteComment = async (commentId, userId, userRole) => {
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });

  if (!comment) throw new AppError('Comment not found', 404, 'NOT_FOUND');

  const isOwnerOrEditor = userRole === 'owner';
  const isAuthor = comment.authorId === userId;

  if (!isAuthor && !isOwnerOrEditor) {
    throw new AppError('You can only delete your own comments', 403, 'FORBIDDEN');
  }

  await db.delete(comments).where(eq(comments.id, commentId));
};
