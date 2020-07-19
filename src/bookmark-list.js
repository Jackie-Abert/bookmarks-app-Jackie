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
        <div>
          <div class="flexcontainer">
            <div class="flexbox1">${bookmark.title}</div>
            <div class="flexbox2">${bookmark.rating}</div>
          </div>
        </div>
        <div class="divcollapse">
          <h2>${bookmark.title}</h2>
          <a data-id="${bookmark.id}" target="_blank" href="${bookmark.url}">Visit Site</a>
          <p>${bookmark.desc}</p> 
          <button type="button" class="bookmark-delete" id="${bookmark.id}">Delete</button>
            <button type ="button" id="edit">Edit</button>
          </div>
      </div>
    </li> 
    `
  }
 
    //this creates a page to create a bookmark page
function generateBookmarkPage() {
    return `
        <div class="container">
          <form id="text-update">
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
              ${[1, 2, 3, 4, 5].map(function(digit) {
              return `<input type="radio" class="rating-input" id="rating-input-1-${6-digit}" name="rating-input-1" value ="${digit}">
              <label for="rating-input-1-${6-digit}" class="rating-star"></label>`;}).join('\n')}
            </span>
            <div>
              <label for="description">Description:</label>
              <input form="text-update" type="text" id="bookmark-description" name="description">
            </div>
            
            <button class "error-container" type ="submit" id="save">Save</button>
            <button type="button" id="cancel">Cancel</button>
          </form>
        </div>`

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
  $('.bookmark-list').html(generateBookmarksListString(store.bookmarks));
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
    values.desc = $('#bookmark-description').val();
    values. rating = $('input[name=rating-input-1]:checked', '#text-update').val()
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
function getItemIdFromElement(bookmarks){
  return $(bookmarks)
    .closest('.bookmark-list')
    .data('id');
}
function handleBookmarkDeleteClicked(){
  console.log("work")
  $('.bookmark-list').on('click', '.bookmark-delete', function(){
    const id = $(this).attr('id');
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

const handleFilterByRating = () => {
  $('#bookmark-rating-filter').on('click', 'input', event => {
    store.filterRating = parseInt($(event.target).val());
    render();
  });
};

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
  handleFilterByRating();
  cnacelNewBookmarkSubmit();
  expandAccordionOnClick();

}


export default {
    generateBookmarksListString,
    bindEventListeners,
    render
}
