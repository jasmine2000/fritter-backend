import type {Request, Response, NextFunction} from 'express';
import type {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CollectionCollection from './collection';

/**
 * Checks that collection with given title and owner Id does not exist (req.body)
 */
const collectionNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const collection = await CollectionCollection.findCollection(req.body.title, req.session.userId);
  if (collection) {
    res.status(409).json({
      error: {
        freetNotFound: 'Collection already exists.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks that collection with given title and owner Id does exist (req.params)
 */
const collectionExists = async (req: Request, res: Response, next: NextFunction) => {
  const collection = await CollectionCollection.findCollection(req.params.title, req.session.userId);
  if (!collection) {
    res.status(403).json({
      error: {
        freetNotFound: 'Collection does not exist for logged in user.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks that freet exists and is not yet in collection
 */
const freetNotInCollection = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.body.freetId);
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  const collection = await CollectionCollection.findCollection(req.params.title, req.session.userId);
  if (collection.posts.includes(req.body.freetId)) {
    res.status(409).json({
      error: {
        freetNotFound: 'Collection already has Freet.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks that freet is in collection
 */
const freetInCollection = async (req: Request, res: Response, next: NextFunction) => {
  const collection = await CollectionCollection.findCollection(req.params.title, req.session.userId);
  if (!collection.posts.includes(req.body.freetId)) {
    res.status(409).json({
      error: {
        freetNotFound: 'Collection does not have Freet.'
      }
    });
    return;
  }

  next();
};

export {
  collectionNotExists,
  collectionExists,
  freetNotInCollection,
  freetInCollection
};
