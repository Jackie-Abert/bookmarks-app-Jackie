'use strict';
let filter = 1;
  const setError = function(error) {
    this.error = error;
  };

  const findById = function(id){
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };
  
  const addBookmark = function(bookmark){
    this.bookmarks.push(bookmark);
  };

  const findAndUpdate = function(id, newData){
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
  };

  const findAndDelete = function(id){
    this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
  };
  
  function filterRating(val) {
    this.filter = val;
  }

  export default {
    bookmarks: [],
    filter,
    setError,
    findById,
    addBookmark,
    findAndUpdate,
    findAndDelete,
    filterRating
  };

