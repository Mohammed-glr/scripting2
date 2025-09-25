

let xhr = new XMLHttpRequest();
xhr.onload = function() {
    if (xhr.status === 200) {
        let studentenData = JSON.parse(xhr.responseText);
        for (let studentData of studentenData) {
            stundenten.push(new Student(
                studentData.voornaam,
                studentData.achternaam,
                studentData.leeftijd,
                studentData.klas,
                studentData.leerjaar,
                studentData.aantalLesuren,
                studentData.aantalVakken,
                studentData.studentNummer
            ));
        }
        for (let studentData of studentenData) {
            console.log('Student:', studentData.voornaam, studentData.achternaam);
            console.log('Leeftijd:', studentData.leeftijd);
            console.log('Klas:', studentData.klas);
            console.log('Vakken:', studentData.vak);
            console.log('VakkenDetails:', studentData.vakkenDetails);
            if (studentData.vrienden) {
                console.log('Vrienden:');
                for (let vriend of studentData.vrienden) {
                    console.log('  Vriend:', vriend.voornaam, vriend.achternaam);
                    console.log('  Vakken:', vriend.vak);
                    console.log('  VakkenDetails:', vriend.vakkenDetails);
                }
            }
            console.log('-----------------------------');
        }
    } else {
        console.error("Failed to load student data. Status:", xhr.status);
    }
};
xhr.onerror = function() {
    console.error("Network error while trying to load student data.");
};
xhr.open("GET", "students.json", true);
xhr.send();
