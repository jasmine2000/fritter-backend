import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

// Type definition for Freet on the backend
export type Collection = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  title: string;
  ownerId: Types.ObjectId;
  posts: Types.ObjectId[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CollectionSchema = new Schema<Collection>({
  // The title of the Collection
  title: {
    type: String,
    required: true
  },
  // The owner userId
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The posts in collection
  posts: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const CollectionModel = model<Collection>('Collection', CollectionSchema);
export default CollectionModel;
