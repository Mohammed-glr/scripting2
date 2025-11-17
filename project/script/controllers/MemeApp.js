
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

        const loadButton = document.getElementById('loadButton');
        if (loadButton) {
            loadButton.addEventListener('click', () => this.loadMemes());
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
