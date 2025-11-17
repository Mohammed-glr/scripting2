/**
 * MemeAPI Service Class
 * Handles all HTTP requests to the server
 */
class MemeAPI {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Fetch all memes from the server
     * @returns {Promise<Array>} Array of meme objects
     */
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

    /**
     * Save a new meme to the server
     * @param {Object} memeData - Object containing meme properties
     * @returns {Promise<Object>} Server response
     */
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
