/**
 * MemeUI Class
 * Handles all DOM manipulation and display logic
 */
class MemeUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found`);
        }
    }

    /**
     * Clear all content from the container
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * Show empty state message
     */
    showEmptyMessage() {
        if (this.container) {
            this.container.innerHTML = '<p>No memes found. Add some!</p>';
        }
    }

    /**
     * Display a single meme card
     * @param {Meme} meme - Meme object to display
     */
    displayMeme(meme) {
        if (this.container) {
            const card = meme.createCard();
            this.container.appendChild(card);
        }
    }

    /**
     * Display multiple memes
     * @param {Array} memes - Array of meme data objects
     */
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
