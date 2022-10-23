import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a follow
 *
 * @name POST /api/follow
 *
 * @param {string} userId - user to follow
 * @return {FollowResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the other user does not exist
 * @throws {409} - If the other user is already followed
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.followedExists,
    followValidator.followObjNotExist
  ],
  async (req: Request, res: Response) => {
    const follow = await FollowCollection.createFollow(req.session.userId, req.body.userId);
    res.status(200).json({
      message: `Now following user ${follow.followedId.toString()}`,
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follow/:userId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the userId is invalid or has not been followed
 */
router.delete(
  '/:userId?',
  [
    userValidator.isUserLoggedIn,
    followValidator.followedExists,
    followValidator.followObjExist
  ],
  async (req: Request, res: Response) => {
    await FollowCollection.findAndDeleteOne(req.session.userId, req.params.userId);
    res.status(200).json({
      message: `Your successfully unfollowed ${req.params.userId}`
    });
  }
);

export {router as followRouter};
