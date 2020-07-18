'use strict';

import $ from 'jquery';
import 'normalize.css';
import './index.css';
import store from './store';
import api from './api';

  function generateError(message){
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }
//this puts all the crap together in a string for the dom to read
  function generateBookmarksListString(bookmarkList){
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }
//this creates the bookmark elements including the on click expand
  function generateBookmarkElement(bookmark){
    console.log("generateBookmarkElement working")
    return `
    <li>
      <div class ="divexpand">
        <h1>${bookmark.title}</h1>
        <div class="divcollapse">
          <h2>Testing one two three</h2>
        </div>
      </div>
    </li> 
    `
  }
   
    // return `
    // <li>
    //   <div class="divexpand">  
    //     <div class="flexcontainer">
    //       <div class="flexbox1">${bookmark.title}</div>
    //       <div class="flexbox2">"rating here"</div>
    //       <div class "flexbox3"><button type ="submit" id="edit">Edit</button>
    //     </div>
    //     <div class="divcollapse">
    //         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"</p>
    //     </div>
    //   </div>  

    // </li>
    // `;
//this creates a page to create a bookmark page
function generateBookmarkPage() {
    return `
        <div class="container">
          <div class="box1">
            <div class="titlediv">
              <label for="url">Title:</label>
              <input form="text-update" type="text" id="bookmark-title" name="title">
            </div>
            <div class="urldiv">
              <label for="url">URL:</label>
              <input form="text-update" type="text" id="bookmark-url" name="url">
            </div>
            </div>
              <span class="rating" form="text-update">
                <input type="radio" class="rating-input" id="rating-input-1-5" name="rating-input-1">
                <label for="rating-input-1-5" class="rating-star"></label>
                <input type="radio" class="rating-input" id="rating-input-1-4" name="rating-input-1">
                <label for="rating-input-1-4" class="rating-star"></label>
                <input type="radio" class="rating-input" id="rating-input-1-3" name="rating-input-1">
                <label for="rating-input-1-3" class="rating-star"></label>
                <input type="radio" class="rating-input" id="rating-input-1-2" name="rating-input-1">
                <label for="rating-input-1-2" class="rating-star"></label>
                <input type="radio" class="rating-input" id="rating-input-1-1" name="rating-input-1">
                <label for="rating-input-1-1" class="rating-star"></label>
              </span>
            <div>
              <label for="description">Description:</label>
              <input form="text-update" type="text" id="bookmark-description" name="description">
            </div>
          <form id="text-update">
            <button class "error-container" type ="submit" id="save">Save</button>
            <button type="button" id="cancel">Cancel</button>
             </form>`
}

function renderError(){
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
}

function closeError(){
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
}

function render(){
  renderError();
  $('.bookmark-list').append(generateBookmarksListString(store.bookmarks));
}

function getItemIdFromElement(bookmarks){
  return $(bookmarks)
    .closest('.bookmark-list')
    .data('item-id');
}

// this works don't mess with it
function handleNewPageSubmit() {
  $('#newBookmark').on('click', event => {
    $('main').html(generateBookmarkPage())
    event.preventDefault();
  })
}
//this submits to the api don't mess with it
function handleNewBookmarkSubmit(){
  $('main').on('submit', '#text-update', function(event){
    event.preventDefault();
    const values = {};
    values.title = $('#bookmark-title').val();
    values.url = $('#bookmark-url').val();
    values.description = $('#bookmark-description').val();
    api.addBookmark(values)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        location.reload();
        render();
      })
      .catch((err) => {
        store.setError(err.message);
        renderError();
      });
  });
}

function cnacelNewBookmarkSubmit() {
  $('main').on('click', '#cancel', event => {
    event.preventDefault();
    location.reload();
  })
}
function handleBookmarkDeleteClicked(){
  $('.bookmarks-list').on('click', '.bookmark-delete', event => {
    const id = getItemIdFromElement(event.currentTarget);

    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((err) => {
        console.log(err);
        store.setError(err.message);
        renderError();
      });
  });
}

function handleMinimumRatingFilter(){
  $('.bookmark-rating-filter').on('change', event => {
    let rating = $(event.target).val();
    store.minimumRating = rating;
    render();
  });
}

function expandAccordionOnClick(){
  $('main').on('click', '.divexpand', function(){
    $(this).find('.divcollapse').slideToggle('slow');
  })
}

function bindEventListeners(){
  closeError();
  handleNewPageSubmit();
  handleNewBookmarkSubmit();
  handleBookmarkDeleteClicked();
  handleMinimumRatingFilter();
  cnacelNewBookmarkSubmit();
  expandAccordionOnClick();
}


export default {
    generateBookmarksListString,
    bindEventListeners,
    render
}
