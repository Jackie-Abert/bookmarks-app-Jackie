'use strict';

  const setError = function(error) {
    this.error = error;
  };

  const findById = function(id){
    return this.bookmark.find(bookmark => bookmark.id === id);
  };
  
  const addBookmark = function(bookmark){
    this.bookmark.push(bookmark);
  };

  const findAndUpdate = function(id, newData){
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
  };

  const findAndDelete = function(id){
    this.bookmark = this.bookmark.filter(bookmark => bookmark.id !== id);
  };

  export default {
    setError,
    findById,
    addBookmark,
    findAndUpdate,
    findAndDelete,
  };

