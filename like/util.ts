import type {HydratedDocument} from 'mongoose';
import type {Like} from './model';

type LikeResponse = {
  _id: string;
  postId: string;
  userId: string;
};

/**
 * Transform a raw like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} freet - A freet
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: Like = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: likeCopy._id.toString(),
    postId: likeCopy.postId.toString(),
    userId: likeCopy.userId.toString()
  };
};

export {
  constructLikeResponse
};
