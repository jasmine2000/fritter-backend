/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createLike(fields) {
  fetch('/api/likes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteLike(fields) {
  fetch(`/api/likes/${fields.postId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewLikesByUser(fields) {
  fetch(`/api/likes?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewLikes(fields) {
  fetch('/api/likes')
    .then(showResponse)
    .catch(showResponse);
}
