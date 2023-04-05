'use strict';
/////////////////////////
// SELECTING ELEMENTS //
///////////////////////

import imgUrl from './images/icon-location.svg';
const form = document.querySelector('.form');
const searchIp = document.querySelector('.search-input');
const ipAddress = document.querySelector('.ip-address');
const location = document.querySelector('.location');
const timezone = document.querySelector('.timezone');
const isp = document.querySelector('.isp');
const error = document.querySelector('.error');
const API_KEY = 'at_YJJlxMZoK3lKFi1nrJVyVEsqdEPvd';

let ipData;
let locationData;
let timezoneData;
let ispData;
let ipExpresion = '';
let lat;
let lng;
let map;
const ownGeoLocation = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
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

  const myIcon = L.icon({
    iconUrl: imgUrl,
    iconSize: [46, 56],
    iconAnchor: [22, 94],
  });

  L.marker(coords, { icon: myIcon }).addTo(map).openPopup();
};

const ownLocation = async function (url) {
  try {
    const resLocation = await fetch(url);
    if (!resLocation.ok)
      throw new Error('Something went wrong through the process.');

    const dataLocation = await resLocation.json();
    lat = dataLocation.location.lat;
    lng = dataLocation.location.lng;

    mapLocation(lat, lng);
    getGeoData(dataLocation);
  } catch (err) {
    console.error('There is an error in the request:', err);
  }
};

ownLocation(ownGeoLocation);

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
    const requestGeoLocation = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipExpresion}`;
    ownLocation(requestGeoLocation);
    error.classList.add('hidden');
    error.innerHTML = '';
  } else {
    error.classList.remove('hidden');
    error.innerHTML = 'This IP does not exist, please try again.';
  }

  searchIp.value = '';
});
