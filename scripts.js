import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Initializes the page numbers and titles for the books and authors
let page = 1;
let matches = books;

/**
 * 
 * @param {*} book 
 * @returns 
 */
// Iterates through matches and creates preview elements for first page
   function createPreviewButton(book) {
 const { id, image, title, author } = book;
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = `
        <img class="preview__image" src="${image}"/>
        <div class="preview__info"><h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
        </div>
    `;

  return element;
}

/**
 * 
 * @param {*} bookList 
 */

function renderBooks(bookList) {
    const fragment = document.createDocumentFragment();
    bookList.slice(0, BOOKS_PER_PAGE).forEach(book => {
        const element = createPreviewButton(book);
        fragment.appendChild(element);
        authorsOption();
        createGenreOption();
    });

// // Appends initial previews to the document
document.querySelector('[data-list-items]').innerHTML = '';
document.querySelector('[data-list-items]').appendChild(fragment);

}

function updateShowMoreButton() {
    const remaining = Math.max(matches.length - (page * BOOKS_PER_PAGE), 0);
    const button = document.querySelector('[data-list-button]');
    button.innerText = `Show more (${remaining})`;
    button.disabled = remaining <= 0;
}


function authorsOption() {
    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = createOptionElement('any', "All Authors");
    authorsHtml.appendChild(firstAuthorElement);

    for (const [id, name] of Object.entries(authors)) {
        authorsHtml.appendChild(createOptionElement(id, name));
    }
    document.querySelector('[data-search-authors]').appendChild(authorsHtml);
}

function createGenreOption() {
    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = createOptionElement('any', "All Genres");
    genreHtml.appendChild(firstGenreElement);

    for (const [id, name] of Object.entries(genres)) {
        genreHtml.appendChild(createOptionElement(id, name));
}
document.querySelector('[data-search-genres]').appendChild(genreHtml);
}

/**
 * 
 * @param {*} value 
 * @param {*} name 
 * @returns 
 */

function createOptionElement(value, name) {
    const element = document.createElement('option');
    element.value = value;
    element.innerText = name;
    return element
}

/**
 * 
 * @param {*} filters 
 */

function handleBookSearch(filters) {
    const result = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        return (
            (filters.title.trim() === '' || book.title.toLocaleLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
    );
});


// resets to first page
page = 1;
matches = result;
renderBooks(matches);
updateShowMoreButton();
}

// Add event listener
// Adds event listener to show setting overlay when search icon is clicked
document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-search-form]').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    handleBookSearch(filters);
    document.querySelector('[data-search-overlay]').open = false;
});

// Adds event listeners to hide search overlay when cancel button is clicked
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

// Adding event listener to show settings overlay when settings icon is clicked.
document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

// Event listener to handle theme change submission
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData.entries());
    
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    // Close settings overlay after theme change
    document.querySelector('[data-settings-overlay]').open = false;
});

// Set cancel button to false for setting icon
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})


document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment();
    matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE).forEach(book => {
        const element = createPreviewButton(book);
        fragment.appendChild(element);
    });
    document.querySelector('[data-list-items]').appendChild(fragment);
    page += 1;
    updateShowMoreButton()
});

// // Adding event listener to hide book details overlay when close button is clicked.
document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})


document.querySelector('[data-list-items]').addEventListener('click', event => {
    const previewButton = event.target.closest('[data-preview]');
    if (!previewButton) return;
    const activeBook = matches.find(book => book.id === previewButton.dataset.preview);
    if(activeBook) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = activeBook.image
        document.querySelector('[data-list-image]').src = activeBook.image
        document.querySelector('[data-list-title]').innerText = activeBook.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[activeBook.author]} (${new Date(activeBook.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = activeBook.description
    }
});

renderBooks(matches);
updateShowMoreButton();




