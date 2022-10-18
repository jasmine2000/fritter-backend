import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Collection} from './model';

// Update this if you add a property to the Freet type!
type CollectionResponse = {
  _id: string;
  title: string;
  ownerId: string;
  posts: string[];
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Collection>} collection - A collection
 * @returns {CollectionResponse} - The collection object formatted for the frontend
 */
const constructCollectionResponse = (collection: HydratedDocument<Collection>): CollectionResponse => {
  const collectionCopy: Collection = {
    ...collection.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const posts = (collectionCopy.posts ?? []).map(post => post as unknown as string);
  delete collectionCopy.posts;
  return {
    ...collectionCopy,
    _id: collectionCopy._id.toString(),
    ownerId: collectionCopy.ownerId.toString(),
    posts
  };
};

export {
  constructCollectionResponse
};
