const themeBtn = document.querySelector('.theme');
const main = document.querySelector('.main');
const header = document.querySelector('.header');
const body = document.querySelector('body');
const input = document.querySelector('.main__lookfor-input_search');
const filterBtn = document.querySelector('.main__lookfor-filter_btn-link');
const dropdownMenu = document.querySelector('.dropdown_menu');

const API_URL = './data.json';

async function fetchAPIData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

const sectionForCountries = document.querySelector('.main__countries');

async function displayCountries (results) {
    if (!sectionForCountries) return;

    sectionForCountries.innerHTML = '';

    results.forEach(country => {

        const div = document.createElement('div');
        div.classList.add('main__countries-info');
        div.innerHTML = `
            <div class="main__countries-info_img" style="background: url(${country.flags.svg}); background-repeat: no-repeat; background-size: cover; background-position: center;">
            </div>
            <div class="main__countries-info_general">
                <p class="main__countries-info_general-name"><a href="./country-details.html?name=${country.name}">${country.name}</a></p>
                <p class="main__countries-info_general-data">Population: <span>${addCommasToNumber(country.population)}</span></p>
                <p class="main__countries-info_general-data">Region: <span>${country.region}</span></p>
                <p class="main__countries-info_general-data">Capital: <span>${country.capital}</span></p>
            </div>
        `;

        sectionForCountries.appendChild(div);
    })

}

const countries = document.querySelectorAll('.main__countries-info_general-name a');

countries.forEach(country => {
    country.addEventListener('click', () => {
        displayCountryInfo(country)
    })
})

async function displayCountryInfo(countryName) {

    const countries = await fetchAPIData();
    const countryData = countries.find(country => country.name === countryName);
    const mainDetails = document.querySelector('.details__main');

    if (!mainDetails) return;
    const section = document.createElement('section');
    section.classList.add('details__main-information')
    section.innerHTML = `
        <div class="details__main-information_img" style="background: url(${countryData.flags.svg}); background-size: cover; background-position: center center">
        </div>
        <article class="details__main-information_general">
            <p class="details__main-information_general-header">${countryData.name}</p>
            <div class="details__main-information_general-indexes">
                <div class="details__main-information_general-indexes_first">
                    <p class="main__countries-info_general-data">Native Name: <span>${countryData.nativeName}</span></p>
                    <p class="main__countries-info_general-data">Population: <span>${addCommasToNumber(countryData.population)}</span></p>
                    <p class="main__countries-info_general-data">Region: <span>${countryData.region}</span></p>
                    <p class="main__countries-info_general-data">Sub Region: <span>${countryData.subregion}</span></p>
                    <p class="main__countries-info_general-data">Capital: <span>${countryData.capital}</span></p>
                </div>
                <div class="details__main-information_general-indexes_second">
                    <p class="main__countries-info_general-data">Top Level Domain: <span>${countryData.topLevelDomain}</span></p>
                    <p class="main__countries-info_general-data">Currencies: <span>${countryData.currencies.map(currency => currency.name).join(', ')}</span></p>
                    <p class="main__countries-info_general-data">Languages: <span>${countryData.languages.map(language => language.name).join(', ')}</span></p>
                </div>
            </div>
            <div class="details__main-information_general-borders">
                Border Countries:
                ${countryData.borders && countryData.borders.length > 0 ?
                    countryData.borders.map(border => {
                     const borderCountry = countries.find(country => country.alpha3Code === border);
                     return borderCountry ? `<div><a href="./country-details.html?name=${borderCountry.name}">${borderCountry.name}</a></div>` : '';
                    }).join(' ') : 
                'none'}
            </div>
        </article>
    `;

    mainDetails.append(section);
}

function modifyCountryInfo() {
    const countryElements = document.querySelectorAll('.main__countries-info');

    countryElements.forEach(element => {
        element.classList.toggle('dark-element');
    });
}

const dropdownMenuItem = document.querySelectorAll('.dropdown_menu li a');

function modifyDropdownMenu() {

    dropdownMenuItem.forEach(item => {
        item.classList.toggle('dropdown_item-dark');
    })
}

// Функція для перемикання теми
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Збереження обраної теми в localStorage
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
}

  // Додаємо обробник подій для кнопки
themeBtn.addEventListener('click', toggleTheme);

  // Перевіряємо, чи є збережена тема в localStorage і встановлюємо її
const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}


async function searchCoutry() {
    const searchQuery = input.value.trim().toLowerCase();
    console.log(searchQuery);
    sectionForCountries.innerHTML = '';

    if (searchQuery !== '') {
        const searchResults = await fetchAPIData();
        const searchCountry = searchResults.filter(country => country.name.toLowerCase().includes(searchQuery));
        if (searchCountry.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No results found';
            sectionForCountries.appendChild(p);
        } else {
            displayCountries(searchCountry);
        }
    } else {
        const countries = await fetchAPIData();
        displayCountries(countries);
        alert('Please, write some words in a search query')
    }
    
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function filterCountriesByRegion(region) {
    const filteredResult = await fetchAPIData();
    const filteredCountries = filteredResult.filter(country => country.region === region);
    displayCountries(filteredCountries);
    dropdownMenu.classList.remove('dropdown-menu-active');
}

async function init() {

    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/') {
        const countries = await fetchAPIData();
        displayCountries(countries);

        const searchForm = document.querySelector('form');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            searchCoutry();
        })

        const searchIcon = document.querySelector('#icon-search');
        searchIcon.addEventListener('click', (e) => {
            searchCoutry();
        })

        const dropdownBtn = document.querySelector('.main__lookfor-filter_btn');
        dropdownBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('dropdown-menu-active');
        })

        dropdownMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown_item')) {
                e.preventDefault();
                const region = e.target.getAttribute('data-region');
                filterCountriesByRegion(region);
            }
        })
    } else if (path.includes('country-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const countryName = urlParams.get('name');

        if (countryName) {
            displayCountryInfo(countryName);
        } else {
            console.error('No country specified');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);