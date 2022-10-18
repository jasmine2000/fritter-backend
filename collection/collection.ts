import type {HydratedDocument, Types} from 'mongoose';
import type {Collection} from './model';
import UserCollection from '../user/collection';
import CollectionModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class CollectionCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} title - The name the collection
   * @param {string} ownerId - The id of the owner of the collection
   * @return {Promise<HydratedDocument<Collection>>} - The newly created collection
   */
  static async create(title: string, ownerId: Types.ObjectId | string): Promise<HydratedDocument<Collection>> {
    const collection = new CollectionModel({
      title,
      ownerId,
      posts: []
    });
    await collection.save();
    return collection;
  }

  /**
   * Find a collection by collectionId
   *
   * @param {string} collectionId - The id of the collection to find
   * @return {Promise<HydratedDocument<Collection>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(collectionId: Types.ObjectId | string): Promise<HydratedDocument<Collection>> {
    return CollectionModel.findOne({_id: collectionId});
  }

  /**
   * Find a collection by title and ownerId
   *
   * @param {string} title - The name the collection
   * @param {string} ownerId - The id of the owner of the collection
   * @return {Promise<HydratedDocument<Collection>>} - The collection
   */
  static async findCollection(title: string, ownerId: Types.ObjectId | string): Promise<HydratedDocument<Collection>> {
    return CollectionModel.findOne({title, ownerId});
  }

  /**
   * Get all the collections owned by one owner
   *
   * @param {string} username - The username of owner of the collections
   * @return {Promise<HydratedDocument<Collection>[]>} - An array of the collections owned by username
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Collection>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return CollectionModel.find({ownerId: owner._id});
  }

  /**
   * Add a freet to the collection
   *
   * @param {string} title - The name the collection
   * @param {string} ownerId - The id of the owner of the collection
   * @param {string} freetId - The id of the freet to be added
   * @return {Promise<HydratedDocument<Collection>[]>} - The collection just added to
   */
  static async addFreet(title: string, ownerId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<Collection>> {
    const collection = await CollectionModel.findOne({title, ownerId});
    collection.posts.push(freetId);
    await collection.save();
    return collection;
  }

  /**
   * Remove a freet from the collection
   *
   * @param {string} title - The name the collection
   * @param {string} ownerId - The id of the owner of the collection
   * @param {string} freetId - The id of the freet to be added
   * @return {Promise<HydratedDocument<Collection>[]>} - The collection just removed from
   */
  static async removeFreet(title: string, ownerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Collection>> {
    const collection = await CollectionModel.findOne({title, ownerId});
    collection.posts = collection.posts.filter(f => f.toString() !== freetId.toString());
    await collection.save();
    return collection;
  }

  /**
   * Delete a collection with title and ownerId
   *
   * @param {string} title - The name the collection
   * @param {string} ownerId - The id of the owner of the collection
   * @return {Promise<Boolean>} - true if the collection has been deleted, false otherwise
   */
  static async findAndDelete(title: string, ownerId: Types.ObjectId | string): Promise<boolean> {
    const collection = await CollectionModel.findOneAndDelete({title, ownerId});
    return collection !== null;
  }
}

export default CollectionCollection;
