'use strict';
import $ from 'jquery';
import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';


//this is working
function main(){
  
  bookmarkList.bindEventListeners();
  bookmarkList.render();
  api.getBookmarks()
  .then((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
  })
  .catch(err => console.log(err.message));
};
$(main);