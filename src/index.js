import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-aio';

const DEBOUNCE_DELAY = 300;
const inputText = document.querySelector('#search-box');
console.log(inputText);
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputText.addEventListener(
  'input',
  debounce(searchCountryInfo, DEBOUNCE_DELAY)
);
const updatePage = (info = '', list = '' ) => {
  countryInfo.innerHTML = info;
  countryList.innerHTML = list;
}

function searchCountryInfo(event) {
  updatePage ()
  const searchCountry = event.target.value.trim();
  if (!searchCountry) {
    return;
  }
  
  fetchCountries(searchCountry)
    .then(createMarkupCountry)
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function showCountryCard () {
  return countries
      .map(({ name, capital, flags, population, languages }) => {
        return `<div class="box"><img class="country-info-img" src="${
          flags.svg
        }" alt="${name.official}" width="50" height="40">
      <h2 class="country-info-title">${name.official}</h2></div>
      <ul class="country-info-list">
        <li class="country-info-item">
          <p class="country-info-text">Capital: <span class="text-info">${
            capital[0]
          }</span></p>
        </li>
        <li class="country-info-item">
          <p class="country-info-text">Population: <span class="text-info">${population}</span></p>
        </li>
        <li class="country-info-item">
          <p class="country-info-text">Languages: <span class="text-info">${Object.values(
            languages
          )}</span></p>
        </li>
      </ul>`;
      })
      .join('');
}

function showCountryList () {
  return countries
      .map(({ name, flags }) => {
        return `<li class="country-item"><img class='flags' src="${flags.svg}" alt="${name.official}" width="50" height="40"><p class="country-name">${name.official}</p></li>`;
      })
      .join('');
}

function createMarkupCountry(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1) {
    const markup = showCountryList ()
     updatePage ('', markup )
  } else if (countries.length === 1) {
    const markupInfo = showCountryCard ()
     updatePage (markupInfo)
  }
}