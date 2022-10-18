/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewCollectionByOwner(fields) {
  fetch(`/api/collections?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function createCollection(fields) {
  fetch('/api/collections', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addFreetToCollection(fields) {
  fetch(`/api/collections/${fields.title}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removeFreetFromCollection(fields) {
  fetch(`/api/collections/${fields.title}`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removeCollection(fields) {
  fetch(`/api/collections/${fields.title}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
