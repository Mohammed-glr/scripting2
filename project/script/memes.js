class MemeAPI {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async fetchMemes() {
        const response = await fetch(`${this.baseUrl}read.php`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('JSON parse error:', e);
            console.error('Response text:', text);
            throw new Error('Response is not valid JSON: ' + e.message);
        }
    }

    async saveMeme(memeData) {
        const response = await fetch(`${this.baseUrl}write.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memeData)
        });
        
        const text = await response.text();
        
        if (!response.ok) {
            console.error('Server response:', text);
            throw new Error(`Server error (${response.status}): ${text}`);
        }
        
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Response is not JSON:', text);
            throw new Error('Server returned invalid JSON: ' + text);
        }
    }
}

class Meme {
    constructor(data = {}) {
        this.name = data.name || data.title || '';
        this.url = data.url || data.image || '';
        this.caption = data.caption || data.description || '';
        this.year = data.year || '';
        this.tags = data.tags || '';
    }

    toJSON() {
        return {
            name: this.name,
            url: this.url,
            caption: this.caption,
            year: this.year,
            tags: this.tags
        };
    }

    isValid() {
        return this.name.trim() !== '' && this.url.trim() !== '';
    }

    // an HTML card element for displaying the meme
    createCard() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'meme-card';
        
        const img = document.createElement('img');
        img.src = this.url;
        img.alt = this.caption;
        cardDiv.appendChild(img);
        
        const nameElem = document.createElement('h3');
        nameElem.textContent = this.name;
        cardDiv.appendChild(nameElem);
        
        const captionElem = document.createElement('p');
        captionElem.textContent = this.caption;
        cardDiv.appendChild(captionElem);
        
        const yearElem = document.createElement('p');
        yearElem.textContent = `Year: ${this.year}`;
        cardDiv.appendChild(yearElem);
        
        const tagsElem = document.createElement('p');
        tagsElem.textContent = `Tags: ${this.tags}`;
        cardDiv.appendChild(tagsElem);
        
        return cardDiv;
    }
}

// UI class for managing the display
class MemeUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found`);
        }
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    showEmptyMessage() {
        if (this.container) {
            this.container.innerHTML = '<p>No memes found. Add some!</p>';
        }
    }

    displayMeme(meme) {
        if (this.container) {
            const card = meme.createCard();
            this.container.appendChild(card);
        }
    }

    displayMemes(memes) {
        this.clear();
        if (!memes || memes.length === 0) {
            this.showEmptyMessage();
            return;
        }
        memes.forEach(memeData => {
            const meme = new Meme(memeData);
            this.displayMeme(meme);
        });
    }
}

// for handling form input
class MemeForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {
            name: 'title',
            url: 'image',
            caption: 'description',
            year: 'year',
            tags: 'tags'
        };
    }

    getMemeData() {
        const data = {};
        for (const [key, fieldId] of Object.entries(this.fields)) {
            const element = document.getElementById(fieldId);
            data[key] = element?.value || '';
        }
        return new Meme(data);
    }

    reset() {
        if (this.form) {
            this.form.reset();
        }
    }

    validate(meme) {
        if (!meme.isValid()) {
            alert('Please fill in at least Title and Image URL');
            return false;
        }
        return true;
    }
}

// main Application Controller
class MemeApp {
    constructor() {
        this.api = new MemeAPI();
        this.ui = new MemeUI('memesContainer');
        this.form = new MemeForm('newMeme');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMemes();
    }

    setupEventListeners() {
        const form = document.getElementById('newMeme');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async loadMemes() {
        try {
            console.log('Loading memes...');
            const data = await this.api.fetchMemes();
            console.log('Memes data:', data);
            this.ui.displayMemes(data);
        } catch (error) {
            console.error('Error loading memes:', error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const meme = this.form.getMemeData();
        
        if (!this.form.validate(meme)) {
            return;
        }

        try {
            const response = await this.api.saveMeme(meme.toJSON());
            console.log('Meme saved:', response);
            this.form.reset();
            await this.loadMemes();
        } catch (error) {
            console.error('Error saving meme:', error);
            alert('Failed to save meme: ' + error.message);
        }
    }
}

window.addEventListener('load', () => {
    new MemeApp();
});


