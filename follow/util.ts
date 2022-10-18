import type {HydratedDocument} from 'mongoose';
import type {Follow} from './model';

type FollowResponse = {
  _id: string;
  followerId: string;
  followedId: string;
};

/**
 * Transform a raw follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: Follow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: followCopy._id.toString(),
    followerId: followCopy.followerId.toString(),
    followedId: followCopy.followedId.toString()
  };
};

export {
  constructFollowResponse
};
