/**
 * Meme Model Class
 * Represents a single meme with properties and methods
 */
class Meme {
    constructor(data = {}) {
        this.name = data.name || data.title || '';
        this.url = data.url || data.image || '';
        this.caption = data.caption || data.description || '';
        this.year = data.year || '';
        this.tags = data.tags || '';
    }

    /**
     * Convert meme to JSON format for API
     * @returns {Object} JSON representation of meme
     */
    toJSON() {
        return {
            name: this.name,
            url: this.url,
            caption: this.caption,
            year: this.year,
            tags: this.tags
        };
    }

    /**
     * Validate if meme has required fields
     * @returns {boolean} true if name and url are not empty
     */
    isValid() {
        return this.name.trim() !== '' && this.url.trim() !== '';
    }

    /**
     * Create an HTML card element for displaying the meme
     * @returns {HTMLElement} div element containing meme card
     */
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
