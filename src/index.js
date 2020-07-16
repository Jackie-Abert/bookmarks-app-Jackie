/* eslint-env jquery */
/* eslint-disable no-console */

import $ from 'jquery';
import './index.css';


function newBookmark() {
//this listens for the click of the newBookmark button and loads the new bookmark form page
console.log('working');
  $('#newBookmark').on('click', event => {
      event.preventDefault();
    console.log('working');
    newBookmarkForm();
});
}

    
function newBookmarkForm() {    
  $('main').html(`
    <div class="container">
        <div class="box1">
            <div class="titlediv">
                <label for="url">Title:</label>
                <input form="text-update" type="text" id="title" name="title">
            </div>
            <div class="urldiv">
                <label for="url">URL:</label>
                <input form="text-update" type="text" id="url" name="url">
            </div>
        </div>
          <span class="rating">
          <input type="radio" class="rating-input" id="rating-input-1-5" name="rating-input-1">
              <label for="rating-input-1-5" class="rating-star"></label>
              <input type="radio" class="rating-input"
              id="rating-input-1-4" name="rating-input-1">
              <label for="rating-input-1-4" class="rating-star"></label>
              <input type="radio" class="rating-input"
              id="rating-input-1-3" name="rating-input-1">
              <label for="rating-input-1-3" class="rating-star"></label>
              <input type="radio" class="rating-input"
                  id="rating-input-1-2" name="rating-input-1">
                  <label for="rating-input-1-2" class="rating-star"></label>
                  <input type="radio" class="rating-input"
                  id="rating-input-1-1" name="rating-input-1">
              <label for="rating-input-1-1" class="rating-star"></label>
              </span>
      <div>
          <label for="description">Description:</label>
          <input form="text-update" type="text" id="description" name="description">
          </div>
          </div>`);
        }

        // function watchForm () {
            
            // }
            
function getBookmark() {
  const BASE_URL = `https://thinkful-list-api.herokuapp.com/${user}/bookmarks`;
  fetch(BASE_URL)
    .then(res => {
      return res.json();
    })
    .then("do something");
  console.log(BASE_URL);
}


function addBookmark() {
$('#text-update').submit( event => {
    event.preventDefault();

    let title = $('#title').val().trim();
    let url = $('#url').val().trim();
    let description = $('#description').val().trim();
    getBookmark(); 
});
}
$(newBookmark);