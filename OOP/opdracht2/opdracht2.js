

let xhr = new XMLHttpRequest();
xhr.onload = function() {
    if (xhr.status === 200) {
        let studentenData = JSON.parse(xhr.responseText);
        let studentContainer = document.getElementById('student-container');
        
        for (let studentData of studentenData) {
            let studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            
            let studentInfo = document.createElement('div');
            studentInfo.className = 'student-info';
            studentInfo.innerHTML = `
                <h2>${studentData.voornaam} ${studentData.achternaam}</h2>
                <p><strong>Leeftijd:</strong> ${studentData.leeftijd}</p>
                <p><strong>Klas:</strong> ${studentData.klas}</p>
                <p><strong>Leerjaar:</strong> ${studentData.leerjaar}</p>
                <p><strong>Studentnummer:</strong> ${studentData.studentNummer}</p>
            `;
            
            let subjectsDiv = document.createElement('div');
            subjectsDiv.className = 'subjects';
            subjectsDiv.innerHTML = `<h3>Vakken:</h3>`;
            let subjectsList = document.createElement('ul');
            if (studentData.vak) {
                studentData.vak.forEach(vak => {
                    let li = document.createElement('li');
                    li.textContent = vak;
                    subjectsList.appendChild(li);
                });
            }
            subjectsDiv.appendChild(subjectsList);
            
            if (studentData.vakkenDetails) {
                let detailsDiv = document.createElement('div');
                detailsDiv.className = 'subject-details';
                detailsDiv.innerHTML = `<h3>Vakken Details:</h3>`;
                let detailsList = document.createElement('ul');
                studentData.vakkenDetails.forEach(detail => {
                    let li = document.createElement('li');
                    li.textContent = `${detail.naam}: ${detail.cijfer || 'Geen cijfer'}`;
                    detailsList.appendChild(li);
                });
                detailsDiv.appendChild(detailsList);
                studentInfo.appendChild(detailsDiv);
            }
            
            studentInfo.appendChild(subjectsDiv);
            studentCard.appendChild(studentInfo);
            
            if (studentData.vrienden) {
                let friendsDiv = document.createElement('div');
                friendsDiv.className = 'friends';
                friendsDiv.innerHTML = `<h3>Vrienden:</h3>`;
                
                studentData.vrienden.forEach(vriend => {
                    let friendDiv = document.createElement('div');
                    friendDiv.className = 'friend';
                    friendDiv.innerHTML = `
                        <h4>${vriend.voornaam} ${vriend.achternaam}</h4>
                        <p><strong>Leeftijd:</strong> ${vriend.leeftijd}</p>
                        <p><strong>Klas:</strong> ${vriend.klas}</p>
                        <p><strong>Studentnummer:</strong> ${vriend.studentNummer}</p>
                    `;
                    
                    if (vriend.vak) {
                        let friendSubjects = document.createElement('p');
                        friendSubjects.innerHTML = `<strong>Vakken:</strong> ${vriend.vak.join(', ')}`;
                        friendDiv.appendChild(friendSubjects);
                    }
                    
                    if (vriend.vakkenDetails) {
                        let friendDetails = document.createElement('ul');
                        friendDetails.innerHTML = '<strong>Vakken Details:</strong>';
                        vriend.vakkenDetails.forEach(detail => {
                            let li = document.createElement('li');
                            li.textContent = `${detail.naam}: ${detail.cijfer || 'Geen cijfer'}`;
                            friendDetails.appendChild(li);
                        });
                        friendDiv.appendChild(friendDetails);
                    }
                    
                    friendsDiv.appendChild(friendDiv);
                });
                
                studentCard.appendChild(friendsDiv);
            }
            
            studentContainer.appendChild(studentCard);
        }
    } else {
        let studentContainer = document.getElementById('student-container');
        studentContainer.innerHTML = '<p class="error">Failed to load student data. Status: ' + xhr.status + '</p>';
    }
};
xhr.onerror = function() {
    let studentContainer = document.getElementById('student-container');
    studentContainer.innerHTML = '<p class="error">Network error while trying to load student data.</p>';
};
xhr.open("GET", "stundenten.json", true);
xhr.send();
