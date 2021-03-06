'use strict';

import $ from 'jquery';
import 'normalize.css';
import './index.css';
import store from './store';
import api from './api';
import stars1 from './images/stars-1.png';
import stars2 from './images/stars-2.png';
import stars3 from './images/stars-3.png';
import stars4 from './images/stars-4.png';
import stars5 from './images/stars-5.png';


const ratingImage = [
  stars1,
  stars2,
  stars3,
  stars4,
  stars5
]

function render(){
  renderError();
  let rating = 0;
  let bookmarks = store.bookmarks;
  console.log(rating)
  if (store.minRating > rating) {
    bookmarks = store.bookmarks.filter(bookmark => {
        return bookmark.rating == store.minRating;
      });
      $('main').html(generatePage());
      $('.bookmark-list').html(generateBookmarksListString(bookmarks));  
  } else {
    $('main').html(generatePage());
      $('.bookmark-list').html(generateBookmarksListString(bookmarks));
  }
}

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
            <button class="error-container" type ="submit" id="save">Save</button>
            <button type="button" id="cancel">Cancel</button>
        </form>
      </div>
    `
}

function generatePage() {
  return `
    <section>
      <form class="main-container">
        <div>
          <button class=" main-flex1" type ="button" id="newBookmark">New</button>
        </div>
        <div class="sort-button">
          <select class="main-flex2" id="bookmark-rating-filter">
            <label name="Filter"><option value=0 selected="selected">Filter</option></label>
            <label name="five stars"><option value=5>5 Stars</option></label>
            <label name="four stars"><option value=4>4 Stars</option></label>
            <label name="three stars"><option value=3>3 Stars</option></label>
            <label name="two stars"><option value=2>2 Stars</option></label>
            <label name="one star"><option value=1>1 Star</option></label>
            <label name="All"><option value=0>All</option></label>
          </select>
        </div>
      </form>
    </section>
    <section class="container">
      <ul class="bookmark-list">
      </ul>
    </section>
  `
}

function generateBookmarkElement(bookmark){
  return `
  <li>
    <div class ="divexpand">
      <div>
        <div class="flexcontainer">
          <div class="flexbox1">${bookmark.title}</div>
          <div class="flexbox2" id="${bookmark.rating}"><img src="${ratingImage[bookmark.rating-1]}" alt="Star image ${[bookmark.rating]}"><src></div>
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

function expandAccordionOnClick(){
  $('main').on('click', '.divexpand', function(){
    $(this).find('.divcollapse').slideToggle('slow');
  })
}
function cancelNewBookmarkSubmit() {
  $('main').on('click', '#cancel', event => {
    event.preventDefault();
    location.reload();
  })
}
/////////////////////////////////////
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
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
}

function closeError(){
  $('main').on('click', '#cancel-error', () => {
    event.preventDefault();
    store.setError(null);
    renderError();
  });
}

/////////////////////////////////////
function generateBookmarksListString(bookmarkList){
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
}

function handleNewPageSubmit() {
  $('main').on('click','#newBookmark', event => {
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
  $('main').on('click', '.bookmark-delete', function(){
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
function handleFilterByRating(){
  $('main').on('change',".sort-button", event => {
    event.preventDefault();
    store.minRating = $(event.target).val();
    render();
  });
};
/////////////////////////////////////////////////
function bindEventListeners(){
  closeError();
  handleNewPageSubmit();
  handleNewBookmarkSubmit();
  handleBookmarkDeleteClicked();
  handleFilterByRating();
  cancelNewBookmarkSubmit();
  expandAccordionOnClick();
  generatePage();
  getItemIdFromElement();
}


export default {
    ratingImage,
    generateBookmarksListString,
    bindEventListeners,
    render
}
