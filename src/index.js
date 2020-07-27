'use strict';
import $ from 'jquery';
import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';


function main(){
  bookmarkList.bindEventListeners();
  api.getBookmarks()
  .then((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    bookmarkList.render();
  })
  .catch(err => console.log(err.message));
};
$(main);