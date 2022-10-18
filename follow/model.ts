import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

// Type definition for Like on the backend
export type Follow = {
  _id: Types.ObjectId;
  followerId: Types.ObjectId;
  followedId: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // The id of the user following
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The id of the user being followed
  followedId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
