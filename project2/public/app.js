// het pagina laden met de huidige status
window.addEventListener('DOMContentLoaded', loadStatus);

async function loadStatus() {
    try {
        const response = await fetch('/status');
        const data = await response.json();
        
        document.getElementById('battery').textContent = data.battery + '%';
        document.getElementById('mode').textContent = data.mode;
        document.getElementById('position').textContent = data.position;
        document.getElementById('sensors').textContent = data.activeSensors.join(', ') || 'Geen';
        
        const resourcesDiv = document.getElementById('resources');
        resourcesDiv.innerHTML = data.resources.map(r => 
            `<span class="resource-tag">${r}</span>`
        ).join('');

        // sensor checkboxes bijwerken
        document.querySelectorAll('input[name="sensors"]').forEach(checkbox => {
            checkbox.checked = data.activeSensors.includes(checkbox.value);
        });
    } catch (error) {
        console.error('Error loading status:', error);
    }
}

document.getElementById('controlForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        action: formData.get('action'),
        sensors: formData.getAll('sensors')
    };

    try {
        const response = await fetch('/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        // Toon succesbericht   
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = result.message;
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);

        // Vernieuw status
        loadStatus();
    } catch (error) {
        console.error('Fout bij het uitvoeren van de actie:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Fout bij het uitvoeren van de actie';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    }
});


async function resetSpacecraft() {
    try {
        const response = await fetch('/reset', {
            method: 'POST'
        });
        const result = await response.json();

        const messageDiv = document.getElementById('message');
        messageDiv.textContent = result.message;
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);

        loadStatus();
    } catch (error) {
        console.error('Fout bij het resetten van het ruimtevaartuig:', error);
    }
}

async function emergencyStop() {
    try {
        const response = await fetch('/emergency-stop', {
            method: 'POST'
        });
        const result = await response.json();

        const messageDiv = document.getElementById('message');
        messageDiv.textContent = result.message;
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);

        loadStatus();
    } catch (error) {
        console.error('Fout bij het uitvoeren van de noodstop:', error);
    }
}

async function loadHistory() {
    try {
        const response = await fetch('/history');
        const data = await response.json();

        const historyContainer = document.getElementById('historyContainer');
        const historyList = document.getElementById('historyList');
        const noHistory = document.getElementById('noHistory');

        if (data.totalActions === 0) {
            historyContainer.style.display = 'none';
            noHistory.style.display = 'block';
            return;
        }

        historyContainer.style.display = 'block';
        noHistory.style.display = 'none';

        historyList.innerHTML = data.history.map((item, index) => `
            <div class="history-item">
                <div class="timestamp">${new Date(item.timestamp).toLocaleString('nl-NL')}</div>
                <div class="action">⚡ ${item.action.toUpperCase()}</div>
                <div class="details">
                    Batterij: ${item.batteryAfter}% | 
                    Positie: ${item.positionAfter} | 
                    Modus: ${item.modeAfter}
                    ${item.sensors.length > 0 ? `<br/>Sensoren: ${item.sensors.join(', ')}` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Fout bij het laden van de geschiedenis:', error);
    }
}