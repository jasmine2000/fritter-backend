import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the likes
 *
 * @name GET /api/likes
 *
 * @return {FreetResponse[]} - A array of all the likes
 */
/**
 * Get likes by user.
 *
 * @name GET /api/likes?username=username
 *
 * @return {FreetResponse[]} - An array of likes created by user with username
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if username query parameter was supplied'
    if (req.query.username !== undefined) {
      next();
      return;
    }

    const userLikes = await LikeCollection.findAll();
    const response = userLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userObj = await UserCollection.findOneByUsername(req.query.username as string);
    const userLikes = await LikeCollection.findByUser(userObj.id);
    const response = userLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a like
 *
 * @name POST /api/likes
 *
 * @param {string} postId - post to be liked
 * @return {LikeResponse} - The created like
 * @throws {403} - If there is a user already logged in
 * @throws {404} - If the post does not exist
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.canCreateLike
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.createLike(req.body.postId, req.session.userId);
    res.status(200).json({
      message: `Post ${like.postId.toString()} liked by user ${like.userId.toString()}`,
      user: util.constructLikeResponse(like)
    });
  }
);

/**
 * Delete a Like
 *
 * @name DELETE /api/likes/:postId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the postId is invalid or has not been liked
 */
router.delete(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.likeExist
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.findAndDeleteOne(req.params.postId, req.session.userId);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
