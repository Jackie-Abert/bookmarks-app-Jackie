//function fetchBookmark() {
//     const BASE_URL = `https://thinkful-list-api.herokuapp.com/${user}/bookmarks`;
//     fetch(BASE_URL)
//     .then(res => {
//         return res.json();
//     })
//     .then()
//     .catch(error => alert('something went wrong.'));
//   }


//function getBookmark() {
//     return fetchBookmark(`${BASE_URL}/bookmarks`);
// };

//function createBookmark() {

}

//function updateBookmark(id, updateData) {
// const newData = JSON.stringify(updateData);
//   return fetchBookmark(`${BASE_URL}/bookmarks/${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: newData
//   });
// };
// //function deleteBookmark(id) {
//         return fetchBookmark(BASE_URL + '/bookmarks/' + id, {
//           method: 'DELETE'
//         });
//       };
// }

// export default {
//     getBookmark,
//     createBookmark,
//     updateBookmark,
//     deleteBookmark
//   };