import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidEditedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const {originalContent} = freet;
  const numEdits = getMinEdits(originalContent, req.body.content);
  console.log(numEdits);
  if (numEdits >= 10) {
    res.status(413).json({
      error: `${numEdits} character adds/removes/replaces is too many.`
    });
    return;
  }

  next();
};

function getMinEdits(originalContent: string, newContent: string): number {
  const memo = new Map<string, number>();
  function minEdits(originalContent: string, newContent: string): number {
    if (!originalContent && !newContent) {
      return 0;
    }

    const key = originalContent.concat('.', newContent);
    if (memo.has(key)) {
      return memo.get(key);
    }

    if (!originalContent || !newContent) {
      return originalContent.length + newContent.length;
    }

    if (originalContent.startsWith(newContent.charAt(0))) {
      return minEdits(originalContent.slice(1), newContent.slice(1));
    }

    const add = minEdits(originalContent, newContent.slice(1));
    const remove = minEdits(originalContent.slice(1), newContent);
    const replace = minEdits(originalContent.slice(1), newContent.slice(1));
    memo.set(key, 1 + Math.min(add, remove, replace));
    return memo.get(key);
  }

  return minEdits(originalContent, newContent);
}

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isValidEditedFreet
};
