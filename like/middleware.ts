import type {Request, Response, NextFunction} from 'express';
import LikeCollection from './collection';

/**
 * Makes sure like does not exist yet
 */
const canCreateLike = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findLike(req.body.postId, req.session.userId);
  if (like) {
    res.status(404).json({
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
  canCreateLike,
  likeExist
};
