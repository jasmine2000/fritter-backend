import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import LikeCollection from './collection';

/**
 * Makes sure post exists
 */
const isPostExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.postId);
  const post = validFormat ? await FreetCollection.findOne(req.body.postId) : '';
  if (!post) {
    res.status(404).json({
      error: {
        postNotFound: 'Post with given ID does not exist.'
      }
    });
    return;
  }

  next();
};

/**
 * Makes sure like does not exist yet
 */
const canCreateLike = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findLike(req.body.postId, req.session.userId);
  if (like) {
    res.status(409).json({
      error: {
        likeFound: 'User has already liked this Post.'
      }
    });
    return;
  }

  next();
};

/**
 * Makes sure like exists
 */
const likeExist = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findLike(req.params.postId, req.session.userId);
  if (!like) {
    res.status(404).json({
      error: {
        likeFound: 'User has not liked this Post.'
      }
    });
    return;
  }

  next();
};

export {
  isPostExists,
  canCreateLike,
  likeExist
};
