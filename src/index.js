import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const nameCountry = searchBox.value.trim();
  if (nameCountry === '') {
    return clearResult();
  }
  fetchCountries(nameCountry)
    .then(country => {
      clearResult();

      if (country.length === 1) {
        countryInfo.insertAdjacentHTML('beforeend', onRenderCountry(country));
      } else if (country.length >= 10) {
        alert();
      } else {
        countryList.insertAdjacentHTML('beforeend', onRenderList(country));
      }
    })
    .catch(error);
}

function alert() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function error() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onRenderList(country) {
  const layoutCountryList = country
    .map(({ name, flags }) => {
      const layout = `
          <li class="country-list__item">
              <img class="country-list__item--flag" src="${flags.svg}" alt="Flag of ${name.official}">
              <h2 class="country-list__item--name">${name.official}</h2>
          </li>
          `;
      return layout;
    })
    .join('');
  return layoutCountryList;
}

function onRenderCountry(country) {
  const layoutCountryInfo = country
    .map(({ name, flags, capital, population, languages }) => {
      const layout = `
        <ul class="country-info__list">
            <li class="country-info__item">
              <img class="country-info__item--flag" src="${
                flags.svg
              }" alt="Flag of ${name.official}">
              <h2 class="country-info__item--name">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-info__item--categories">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Languages: </span>${Object.values(
              languages
            ).join(', ')}</li>
        </ul>
        `;
      return layout;
    })
    .join('');
  return layoutCountryInfo;
}

function clearResult() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
