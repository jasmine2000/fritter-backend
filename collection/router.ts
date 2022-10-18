import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CollectionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as collectionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get collections by owner.
 *
 * @name GET /api/collections?username=username
 *
 * @return {CollectionResponse[]} - An array of collections created by user with username
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 */
router.get(
  '/',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const ownerFreets = await CollectionCollection.findAllByUsername(req.query.username as string);
    const response = ownerFreets.map(util.constructCollectionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new collection.
 *
 * @name POST /api/collections
 *
 * @param {string} title - The title of the collection
 * @return {CollectionResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the collection already exists for this user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    collectionValidator.collectionNotExists
  ],
  async (req: Request, res: Response) => {
    const collection = await CollectionCollection.create(req.body.title, req.session.userId);

    res.status(201).json({
      message: 'Your collection was created successfully.',
      collection: util.constructCollectionResponse(collection)
    });
  }
);

/**
 * Add Freet to Collection
 *
 * @name PUT /api/collections/:collection
 *
 * @param {string} freetId - the freetId to add
 * @return {CollectionResponse} - the updated collection
 * @throws {403} - if the user is not logged in or does not own collection with name
 * @throws {404} - If the freetId is not valid
 * @throws {409} - If the freet is already in the collection
 */
router.put(
  '/:title?',
  [
    userValidator.isUserLoggedIn,
    collectionValidator.collectionExists,
    collectionValidator.freetNotInCollection
  ],
  async (req: Request, res: Response) => {
    const collection = await CollectionCollection.addFreet(req.params.title, req.session.userId, req.body.freetId);
    res.status(200).json({
      message: 'Your freet was added to Collection.',
      collection: util.constructCollectionResponse(collection)
    });
  }
);

// /**
//  * Remove Freet from Collection
//  *
//  * @name DELETE /api/collections/:collection
//  *
//  * @param {string} freetId - the freetId to remove
//  * @return {CollectionResponse} - the updated collection
//  * @throws {403} - if the user is not logged in or does not own collection with name
//  * @throws {404} - If the freetId is not in the collection
//  */
// router.delete(
//   '/:title?',
//   [
//     userValidator.isUserLoggedIn,
//     collectionValidator.collectionExists,
//     collectionValidator.freetInCollection
//   ],
//   async (req: Request, res: Response) => {
//     const collection = await CollectionCollection.removeFreet(req.params.title, req.session.userId, req.body.freetId);
//     res.status(200).json({
//       message: 'Your freet was removed from Collection.',
//       collection: util.constructCollectionResponse(collection)
//     });
//   }
// );

/**
 * Delete Collection
 *
 * @name DELETE /api/collections/:collection
 *
 * @return {CollectionResponse} - the updated collection
 * @throws {403} - if the user is not logged in or does not own collection with name
 */
/**
 * Remove Freet from Collection
 *
 * @name DELETE /api/collections/:collection
 *
 * @param {string} freetId - the freetId to remove
 * @return {CollectionResponse} - the updated collection
 * @throws {403} - if the user is not logged in or does not own collection with name
 * @throws {404} - If the freetId is not in the collection
 */
router.delete(
  '/:title?',
  [
    userValidator.isUserLoggedIn,
    collectionValidator.collectionExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.freetId !== undefined) {
      next();
      return;
    }

    await CollectionCollection.findAndDelete(req.params.title, req.session.userId);
    res.status(200).json({
      message: 'Your Collection was deleted.'
    });
  },
  [
    collectionValidator.freetInCollection
  ],
  async (req: Request, res: Response) => {
    const collection = await CollectionCollection.removeFreet(req.params.title, req.session.userId, req.body.freetId);
    res.status(200).json({
      message: 'Your freet was removed from Collection.',
      collection: util.constructCollectionResponse(collection)
    });
  }
);

export {router as collectionRouter};
