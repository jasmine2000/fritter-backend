import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Create a Like
   *
   * @param {string} postId - The id of the freet
   * @param {string} userId - The liker (user)
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async createLike(postId: Types.ObjectId, userId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      postId,
      userId
    });
    await like.save();
    return like.populate('userId');
  }

  /**
   * Find a like by id
   *
   * @param {string} likeId - The id of the like to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(likeId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.findOne({_id: likeId});
  }

  /**
   * Find a like by postid and userid
   *
   * @param {string} postId - The id of the post to like
   * @param {string} userId - The id of the liker
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findLike(postId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.findOne({postId, userId});
  }

  /**
   * Find likes by postId
   *
   * @param {string} postId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findByPost(postId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    console.log(postId);
    return LikeModel.find({postId});
  }

  /**
   * Find likes by userId
   *
   * @param {string} userId - The id of the liker
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({userId});
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves freets and sorts them from most to least recent
    return LikeModel.find({}).sort({dateModified: -1});
  }

  /**
   * Find a likes by id
   *
   * @param {string} likeId - The id of the like to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async deleteOne(likeId: Types.ObjectId | string): Promise<boolean> {
    const like = LikeModel.deleteOne({_id: likeId});
    return like !== null;
  }

  /**
   * Find a like by postid and userid
   *
   * @param {string} postId - The id of the post to like
   * @param {string} userId - The id of the liker
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findAndDeleteOne(postId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.findOneAndDelete({postId, userId});
    return like !== null;
  }
}

export default LikeCollection;
