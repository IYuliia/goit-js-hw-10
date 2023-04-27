import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  event.preventDefault();
  const name = event.target.value.trim();
  if (!name) {
    clearList();
    clearCountryInfo();
    return;
  }

  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryInfo();
        return;
      }
      if (data.length > 1) {
        renderCountryList(data);
        clearCountryInfo();
        return;
      }
      renderCountryInfo(data[0]);
      clearList();
    })
    .catch(error => {
      console.log(error);
      clearList();
      clearCountryInfo();
      renderError();
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list-item"><img src="${country.flags.svg}" alt="${country.name.official}" width="50" height="30">
        <p class="country-name">${country.name.official}</p>
      </li>
    `;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = `
    <div class="country-info-item">
      <img src="${country.flags.svg}" alt="${
    country.name.official
  }" width="200" height="120">
      <h2 class="country-name">${country.name.official}</h2>
      <p><span class="country-info-label"><strong>Capital:</strong></span> ${
        country.capital[0]
      }</p>
      <p><span class="country-info-label"><strong>Population:</strong></span> ${
        country.population
      }</p>
      <p><span class="country-info-label"><strong>Languages:</strong></span> ${Object.values(
        country.languages
      ).join(', ')}</p>
    </div>
  `;

  countryInfo.innerHTML = markup;
}

function clearList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

function renderError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
