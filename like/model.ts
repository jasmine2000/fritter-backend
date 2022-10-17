import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  // The postId of liked post
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The userId of liker
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
