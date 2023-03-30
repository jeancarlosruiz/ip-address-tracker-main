'use strict';
/////////////////////////
// SELECTING ELEMENTS //
///////////////////////

const form = document.querySelector('.form');
const searchIp = document.querySelector('.search-input');
const submitBtn = document.querySelector('.submit-btn');
const ipAddress = document.querySelector('.ip-address');
const location = document.querySelector('.location');
const timezone = document.querySelector('.timezone');
const isp = document.querySelector('.isp');
const error = document.querySelector('.error');
const API_KEY = 'at_oxyxVq9YzKHakPxDxrTFPYlFyy4FK';

let url;
let ipData;
let locationData;
let timezoneData;
let ispData;
let ipExpresion = '';
let lat;
let lng;
let map;

const myIcon = L.icon({
  iconUrl: '/images/icon-location.svg',
  iconSize: [46, 56],
  iconAnchor: [22, 94],
});

//////////////////////////////////////
// FUNCTIONS TO DO NOT REPEAT CODE //
////////////////////////////////////

const getGeoData = function (data) {
  ipData = data.ip;
  locationData = `${data.location.city}, ${data.location.region}`;
  timezoneData = data.location.timezone;
  ispData = data.isp;
  ipAddress.innerHTML = ipData;
  location.innerHTML = locationData;
  timezone.innerHTML = `UTC ${timezoneData}`;
  isp.innerHTML = ispData;
};

const mapLocation = function (lat, lng) {
  const coords = [lat, lng];

  if (map != undefined) {
    map.remove();
  }

  map = L.map('map').setView(coords, 15);

  L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }).addTo(map);

  L.marker(coords, { icon: myIcon }).addTo(map).openPopup();
};

url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
fetch(url)
  .then(response => response.json())
  .then(data => {
    lat = data.location.lat;
    lng = data.location.lng;

    mapLocation(lat, lng);
    getGeoData(data);
  });

/////////////////////////////
// ADDEVENT FUNCTIONALITIES //
///////////////////////////

form.addEventListener('submit', e => {
  e.preventDefault();

  if (
    searchIp.value.match(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    )
  ) {
    ipExpresion = searchIp.value;
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipExpresion}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        lat = data.location.lat;
        lng = data.location.lng;
        console.log(data);
        mapLocation(lat, lng);
        getGeoData(data);
      });
    error.classList.add('hidden');
    error.innerHTML = '';
  } else {
    error.classList.remove('hidden');
    error.innerHTML = 'This IP doesnt exits, please try again';
  }

  searchIp.value = '';
});
