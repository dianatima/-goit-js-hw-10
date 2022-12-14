import './css/styles.css';
import API from './js/api-service';
import getRefs from './js/get-refs';
import Notiflix from 'notiflix';

var debounce = require('lodash.debounce');

const refs = getRefs();

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const country = event.target.value.trim();
  if (country.length === 0) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  API.fetchCountries(country)
    .then(countries => renderCountries(countries))
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
    });
}

function renderCountries(countries) {
  const countriesNumber = countries.length;

  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (countriesNumber === 1) {
    const cityElem = countries.map(
      ({ name, capital, population, flags, languages }) => {
        return `<div>
          <div class="title">
            <img src="${flags.png}" alt="" width=30 >
            <span class="bold">${name.common}</span>
          </div>
          <p><span class="bold">Capital:</span> ${capital}</p>
          <p><span class="bold">Population:</span> ${population}</p>
          <p><span class="bold">Languages:</span> ${Object.values(
            languages
          )}</p>
        </div>`;
      }
    );
    refs.countryInfo.innerHTML = cityElem;
    return;
  }

  if (countriesNumber > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  const citiesElem = countries.map(
    ({ name, capital, population, flags, languages }) => {
      return `<li>
        <img src="${flags.png}" alt="" width=30 >
        ${name.common}</li>`;
    }
  );
  refs.countryList.innerHTML = citiesElem.join('');
}
