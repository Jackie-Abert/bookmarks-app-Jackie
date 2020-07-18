'use strict';
import $ from 'jquery';
import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';


//this is working
function main(){

  api.getBookmarks()
  .then((bookmarks) => {
    console.log(bookmarks);
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    console.log(store.bookmarks);
    bookmarkList.render();
  })
  .catch(err => console.log(err.message));
  
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};

$(main);