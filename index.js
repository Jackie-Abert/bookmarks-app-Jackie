'use strict';
import $ from 'jquery';
import 'normalize.css';
import './src/index.css';
import api from './src/api';
import store from './src/store';
import bookmarkList from './src/bookmark-list';


//this is working
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