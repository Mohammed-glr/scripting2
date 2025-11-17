
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

    /**
     * Reset form to initial state
     */
    reset() {
        if (this.form) {
            this.form.reset();
        }
    }

    /**
     * Validate meme data
     * @param {Meme} meme - Meme object to validate
     * @returns {boolean} true if valid, false otherwise
     */
    validate(meme) {
        if (!meme.isValid()) {
            alert('Please fill in at least Title and Image URL');
            return false;
        }
        return true;
    }
}
