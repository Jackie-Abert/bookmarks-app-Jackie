'use strict';

import 'normalize.css';
import './index.css';

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jackie/bookmarks';

const listApiFetch = function(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

// GET
function getBookmarks(){
  return listApiFetch(`${BASE_URL}/bookmarks`);
}

// POST
function addBookmark(object){
  const newItem = JSON.stringify(object);
  return listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: newItem
  });
}

// PATCH
function editBookmark(id, updateData){
  const newData = JSON.stringify(updateData);
  return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: newData
  });
}

// DELETE
  function deleteBookmark(id){
  return fetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: ''
  });
};


export default {
  BASE_URL,
  getBookmarks,
  addBookmark,
  editBookmark,
  deleteBookmark
}