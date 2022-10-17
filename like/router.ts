import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all likes.
 *
 * @name GET /api/likes
 *
 * @return {LikeResponse[]} - An array of likes
 *
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const userLikes = await LikeCollection.findAll();
    const response = userLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Get likes by user.
 *
 * @name GET /api/likes?user=username
 *
 * @return {LikeResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If user is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const userObj = await UserCollection.findOneByUsername(req.params.username);
    const userLikes = await LikeCollection.findByUser(userObj.id);
    const response = userLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Get likes by post.
 *
 * @name GET /api/likes/:postId
 *
 * @return {LikeResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/:postId',
  async (req: Request, res: Response) => {
    const userLikes = await LikeCollection.findByPost(req.params.postId);
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
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
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
 * @name DELETE /api/likes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:likeId?',
  [
    likeValidator.likeExist
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.likeId.toString());
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
