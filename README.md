# Fritter

## Code Organization

The project is structured as follows:

- `index.ts` sets up the database connection and the Express server
- `/public` contains the code for the frontend (HTML/CSS/browser JS)

#### Models

- `/freet` contains files related to freet concept
- `/user` contains files related to user concept
- `/like` contains files related to like concept
- `/follow` contains files related to follow concept
- `/collection` contains files related to collection concept


Each model folder contains:
- `collection.ts` contains collection class to wrap around MongoDB database
- `middleware.ts` contains middleware
- `model.ts` contains definition of datatype
- `router.ts` contains backend routes
- `util.ts` contains utility functions for transforming data returned to the client


## Deployed Site

[Click here](https://fritter-backend-jasmine2000.vercel.app/) to find the deployed site.


## API routes

The following api routes have already been implemented for you (**Make sure to document all the routes that you have added.**):

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

### Freets

#### `GET /api/freets` - Get all the freets

**Returns**

- An array of all freets sorted in descending order by date modified

#### `GET /api/freets?author=USERNAME` - Get freets by author

**Returns**

- An array of freets created by user with username `author`

**Throws**

- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

#### `POST /api/freets` - Create a new freet

**Body**

- `content` _{string}_ - The content of the freet

**Returns**

- A success message
- A object with the created freet

**Throws**

- `403` if the user is not logged in
- `400` If the freet content is empty or a stream of empty spaces
- `413` If the freet content is more than 140 characters long

#### `DELETE /api/freets/:freetId?` - Delete an existing freet

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the freet
- `404` if the freetId is invalid

#### `PUT /api/freets/:freetId?` - Update an existing freet

**Body**

- `content` _{string}_ - The new content of the freet

**Returns**

- A success message
- An object with the updated freet

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid
- `403` if the user is not the author of the freet
- `400` if the new freet content is empty or a stream of empty spaces
- `413` if the new freet content is more than 140 characters long
- `413` if the new freet content is more than 10 character adds/deletes/replaces more than the original content

### Users

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PUT /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username is already in use

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in

### Likes

#### `GET /api/likes` - Get likes

**Returns**

- An array of all likes

#### `GET /api/likes?username=USERNAME` - Get likes created by user

**Returns**

- An array of all likes created by user with `username`

**Throws**

- `400` if the username is not given
- `404` if no user has given username

#### `POST /api/likes` - Create a new like

**Body**

- `postId` _{string}_ - The id of post to be liked

**Returns**

- A success message
- A object with the created like

**Throws**

- `403` If the user is not logged in
- `404` If the post does not exist
- `409` If the user has already liked the post

#### `DELETE /api/likes/:postId` - Delete like

**Returns**

- A success message

**Throws**

- `403` If the user is not logged in
- `404` If the post does not exist
- `409` If the user has not liked the post

### Follow

#### `POST /api/follow` - Create follow

**Body**

- `userid` _{string}_ - The id of user to follow

**Returns**

- A success message
- A object with the created follow

**Throws**

- `403` If the user is not logged in
- `404` If the other user does not exist
- `409` If the other user is already followed

#### `DELETE /api/follow/:userId` - Delete follow

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `404` If the other user does not exist or is not followed

### Collections

#### `GET /api/collections?user=USERNAME` - Get Collections by user

**Returns**

- An array of collections created by user with username `username`

**Throws**

- `400` if `username` is not given
- `404` if `username` is not a recognized username of any user

#### `POST /api/collections` - Create a Collection

**Body**

- `title` _{string}_ - The name of collection

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if user is not logged in
- `400` if collection title is empty
- `409` if collection title is already used by user

#### `PUT /api/collections/:title` - Add Freet to Collection

**Body**

- `postId` _{string}_ - The postId of post to add

**Returns**

- A success message
- An object with the updated collection

**Throws**

- `403` if the user is not logged in or does not own collection with name `title`
- `404` if collection or post does not exist
- `409` if the post is already in the collection

#### `DELETE /api/collections/:title` - Remove Freet from Collection

**Body**

- `postId` _{string}_ - The postId of post to remove

**Returns**

- A success message
- An object with the updated collection

**Throws**

- `403` if the user is not logged in or does not own collection with name `title`
- `404` if post is not in the collection

#### `DELETE /api/collections/:title` - Delete Collection

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in or does not own collection with name `title`
