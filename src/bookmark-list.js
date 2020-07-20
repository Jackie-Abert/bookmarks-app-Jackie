'use strict';

import $ from 'jquery';
import 'normalize.css';
import './index.css';
import store from './store';
import api from './api';

const ratingImage = [
  '/images/stars-1.png',
  'images/stars-2.png',
  'images/stars-3.png',
  '/images/stars-4.png',
  '/images/stars-5.png'
]
//when this code runs, the filter works and the drop down filters through
//the rating no problem. When the page loads, nothing shows up and
//I can NOT figure out why. NEED to solve this.
function render(){
  renderError();
  let bookmarks = store.bookmarks.filter(bookmark => {
    return bookmark.rating >= store.filterRating;
  });
  $('.sort-button').html(generateSortButton());
  $('.bookmark-list').html(generateBookmarksListString(bookmarks));
}



/////////////////////////////////////////////////
//forms forms forms forms forms forms forms forms
//forms forms forms forms forms forms forms forms
//forms forms forms forms forms forms forms forms
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
          <span class="rating" form="text-update"><label for="rating">Rating:</label>
            ${[5, 4, 3, 2, 1].map(function(digit) {
            return `<input type="radio" class="rating-input" id="rating-input-1-${6-digit}" name="rating-input-1" value ="${digit}">
            <label for="rating-input-1-${6-digit}" class="rating-star"></label>`;}).join('\n')}
          </span>
          <div>
            <label for="description">Description:</label>
            <input form="text-update" type="text" id="bookmark-description" name="description">
          </div>
            <button class"error-container" type ="submit" id="save">Save</button>
            <button type="button" id="cancel">Cancel</button>
        </form>
      </div>`

}
function generateSortButton() {
  return `
    <select class="main-flex2" id="bookmark-rating-filter">
      <option value=1 selected="selected">rating</option>
      <option value=5>5 Stars</option>
      <option value=4>4 Stars</option>
      <option value=3>3 Stars</option>
      <option value=2>2 Stars</option>
      <option value=1>1 Star</option>
  </select>`
}
function generateBookmarkElement(bookmark){
  return `
  <li>
    <div class ="divexpand">
      <div>
        <div class="flexcontainer">
          <div class="flexbox1">${bookmark.title}</div>
          <div class="flexbox2" id="${bookmark.rating}"><img src="${ratingImage[bookmark.rating-1]}"><src></div>
        </div>
      </div>
      <div class="divcollapse">
        <button class="link"><a data-id="${bookmark.id}" target="_blank" href="${bookmark.url}">Visit Site</a></button>
        <p>${bookmark.desc}</p> 
        <button type="button" class="bookmark-delete" id="${bookmark.id}">Delete</button>
        </div>
    </div>
  </li> 
  `
}
//forms forms forms forms forms forms forms forms
//forms forms forms forms forms forms forms forms
//forms forms forms forms forms forms forms forms
/////////////////////////////////////////////////

function expandAccordionOnClick(){
  $('main').on('click', '.divexpand', function(){
    $(this).find('.divcollapse').slideToggle('slow');
  })
}
function cnacelNewBookmarkSubmit() {
  $('main').on('click', '#cancel', event => {
    event.preventDefault();
    location.reload();
  })
}
/////////////////////////////////////
//error error error error error error 
//error error error error error error 
//error error error error error error 
function generateError(message){
  return `
    <section class="error-content">
      <button id="cancel-error">X</button>
      <p>${message}</p>
    </section>
  `;
}
function renderError(){
  if (store.error) {
    const el = generateError(store.error);
    alert("Please fill out entire form.")
  }
}
function closeError(){
  $('main').on('click', '#cancel-error', () => {
    event.preventDefault();
    store.setError(null);
    renderError();
    generateBookmarkPage();
  });
}
//error error error error error error 
//error error error error error error 
//error error error error error error 
/////////////////////////////////////

/////////////////////////////////////

/////////////////////////////////////
function generateBookmarksListString(bookmarkList){
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
}
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
function getItemIdFromElement(bookmarks){
  return $(bookmarks)
    .closest('.bookmark-list')
    .data('id');
}
function handleBookmarkDeleteClicked(){
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
////////////////////////////////////////////////
////////////////////////////////////////////////
///////////////////////////////////////////////
function handleFilterByRating(){
  $(".sort-button").on('change', event => {
    event.preventDefault();
    let rating = $(event.target).val();
    store.filterRating = rating;
    render();
    
  });
};
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////


/////////////////////////////////////////////////
function bindEventListeners(){
  closeError();
  handleNewPageSubmit();
  handleNewBookmarkSubmit();
  handleBookmarkDeleteClicked();
  handleFilterByRating();
  cnacelNewBookmarkSubmit();
  expandAccordionOnClick();
  generateSortButton();
  getItemIdFromElement();
}


export default {
    ratingImage,
    generateBookmarksListString,
    bindEventListeners,
    render
}
