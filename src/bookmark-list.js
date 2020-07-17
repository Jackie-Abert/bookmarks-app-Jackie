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

  function generateBookmarksListString(bookmarksList){
    const bookmarks = bookmarksList.map(bookmark => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }

  function generateBookmarkElement(bookmark){
    return `
    <li>
      <div class="container" data-item-id="${bookmark.id}">
        <div class="panel-heading" role="tab">
            <h4 class="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#accordion" href="#${bookmark.id}" aria-expanded="true" aria-controls="${bookmark.id}">
                    ${bookmark.title}
                  <span class="bookmark-rating">${(bookmark.rating)}</span>
                </a>
            </h4>
        </div>
        <div id="${bookmark.id}" class="panel-collapse collapse" role="tabpanel">
          <div class="panel-body">
            <p data-id="${bookmark.id}">${bookmark.description}</p>
            <p><a data-id="${bookmark.id}" target="_blank" href="${bookmark.url}">Visit Site</a></p>
            <button type="button" class="btn btn-danger bookmark-delete" data-id="${bookmark.id}">Delete</button>
          </div>
        </div>
      </div>
    </li>
    `;
  }

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
            <button type="submit" id="cancel">Cancel</button>
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
  let bookmarks = store.bookmarks.filter(bookmark => {
    return bookmark.rating >= store.minimumRating;
  });
  
  // populate the 'ul' with html generated data
  $('#bookmarks-list').html(generateBookmarksListString(bookmarks));
}

function getItemIdFromElement(bookmark){
  return $(bookmark)
    .closest('#bookmark-list')
    .data('item-id');
}

// this works don't mess with it
function handleNewPageSubmit() {
  $('#newBookmark').on('click', event => {
    $('main').html(generateBookmarkPage())
    event.preventDefault();
  })
}

function handleNewBookmarkSubmit(){
  $('main').on('submit', '#text-update', function(event){
    event.preventDefault();
    const values = {};
    values.title = $('#bookmark-title').val();
    values.url = $('#bookmark-url').val();
    values.description = $('#bookmark-description').val();
    //values.rating = $('#rating-input-1-5').val();
    api.addBookmark(values)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        render();
      })
      .catch((err) => {
        store.setError(err.message);
        renderError();
      });
      console.log(values);
  });
}

function handleBookmarkDeleteClicked(){
  $('.js-bookmarks-list').on('click', '.bookmark-delete', event => {
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

function bindEventListeners(){
  closeError();
  handleNewPageSubmit();
  handleNewBookmarkSubmit();
  handleBookmarkDeleteClicked();
  handleMinimumRatingFilter();
}


export default {
    generateBookmarksListString,
    bindEventListeners,
    render
}
