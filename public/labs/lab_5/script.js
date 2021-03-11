const { over } = require("cypress/types/lodash");

function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  document.getElementById('mapid').style.height = `${400}px`;
  const map = L.map('mapid').setView([38.9896946148518, -76.93886260848691], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicG9vbDAxMSIsImEiOiJja20zdmVjZHAwYzl2MnBsY2R3MWdoemEyIn0.cdvnKCusaIY45GptcuQcPQ'
  }).addTo(map);
  return map;
}

async function dataHandler(mapObjectFromFunction) {
  // Get the restauraunt data from the api.
  const request = await fetch('/api');
  const restaurants = await request.json();

  let markers = []; // Holds a list of all markers on the map. Empty on page load.

  const search = document.querySelector('.input');
  const form = document.getElementById('search');
  const suggestions = document.querySelector('.suggestions');

  // Filter function for sorting through search results.
  // Also handles duplicate results by excluding them.
  // Returns the top five results.
  function findMatches(restList) {
    const tempArr = restList.filter((place) => place.zip.includes(search.value));
    // Create a list of unique ids by making a set, then converting to an array.
    // Useful for removing duplicate search results.
    const tempSet = new Set(tempArr.map((place) => place.establishment_id));
    const uniqueIDs = Array.from(tempSet);

    const results = [];
    let idLength = uniqueIDs.length - 1;

    function filterResults (place) {
      // Compare the value of the restaurants key to value in uniqueIDs.
      // Halts if no more uniqueIDs is empty.
      if (place.establishment_id === uniqueIDs[idLength] && uniqueIDs.length > 0) {
        results.push(place);
        uniqueIDs.pop();
        idLength = uniqueIDs.length - 1;
      }
    }
    // Iterates through the list until out of unique establishment_id in uniqueIDs.
    while (idLength >= 0) {
      restList.forEach(filterResults);
    }
    // Sorts by zip code in descending order.
    results.sort((a, b) => (b.zip - a.zip));
    return results.slice(0, 5);
  }

  // Event handler called upon submission of the search bar form. Returns
  // a list of of restaurants under the search bar and adds corresponding
  // pins on the adjacent map.
  form.addEventListener('submit', async (evt) => {
    // Clear results list
    suggestions.innerHTML = '';

    // Removes all old markers from the map.
    markers.forEach((marker) => {
      mapObjectFromFunction.removeLayer(marker);
    });
    markers = [];

    evt.preventDefault();
    const matchArray = findMatches(restaurants);

    matchArray.forEach((place) => {
      // Add map markers to layer group.
      // This group will be added to the map later.
      const coords = place.geocoded_column_1.coordinates;
      Console.log(coords);
      const marker = L.marker([coords[1], coords[0]]);
      marker.addTo(mapObjectFromFunction);
      markers.push(marker);
      console.log('Marker added');

      // Creates a new list item and displays it on the page.
      const newResult = document.createElement('li');
      newResult.classList.add('box');
      newResult.classList.add('list-item');
      newResult.innerHTML = `<div class='list-header'>${place.name}</div><address>${place.address_line_1}</address>`;
      suggestions.append(newResult);
      console.log('List item added.');
    });
    if (search.value.length === 0) {
      suggestions.innerHTML = '';
    }
  });
}

// Called when the page is loaded. Initializes the map,
// handles the search function, and handles any other
// actions on the page.
async function windowActions() {
  console.log('page loaded');
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;