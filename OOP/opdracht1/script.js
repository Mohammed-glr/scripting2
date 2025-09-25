// NO OOP
// let studentNaam = "";
// let leerjaar = 1;
// let aantalLesuren = 32;
// let aantalVakken = 4;

// function BrekenUrenPerVak() {
//     let urenPerVak = aantalLesuren / aantalVakken;
//     return urenPerVak;
// }



// OOP


class Student {
    constructor(
        voornaam,
        achternaam,
        leeftijd = Math.floor(Math.random() * 10) + 12,
        klas = "D2D",
        leerjaar = 2,
        aantalLesuren = 32,
        aantalVakken = 4,
        studentNummer = Math.floor(Math.random() * 100000)

    ) {
        this.studentNummer = studentNummer
        this.leeftijd = leeftijd
        this.klas = klas
        this.achternaam = achternaam
        this.voornaam = voornaam
        this.leerjaar = leerjaar
        this.aantalLesuren = aantalLesuren
        this.aantalVakken = aantalVakken
    }

    BrekenUrenPerVak() {
        let urenPerVak = this.aantalLesuren / this.aantalVakken
        return urenPerVak
    }
    Groet() {
        return `Hallo, mijn naam is ${this.voornaam} ${this.achternaam} en ik ben ${this.leeftijd} jaar oud.`
    }
    StudentInfo() {
        return `Student ${this.studentNummer}: ${this.voornaam} ${this.achternaam}, ${this.leeftijd} jaar, klas ${this.klas}, leerjaar ${this.leerjaar}.`
    }
    studentVerjaardag() {
        this.leeftijd++
        return `Hoera! ${this.voornaam} is nu ${this.leeftijd} jaar!`
    }


}

const stundenten = []
stundenten.push(new Student(
    "LEON",
    "VAN DER WERF"
))
stundenten.push(new Student(
    "AISH",
    "CHITTU"
))
stundenten.push(new Student(
    "FINN",
    "VAN DIJK"
))
stundenten.push(new Student(
    "MOHAMED",
    "HAFTAROU"
))
stundenten.push(new Student(
    "STEPHY",
    "LEI"
))

for (let student of stundenten) {
    document.body.innerHTML += `<p>${student.StudentInfo()}</p>`
    document.body.innerHTML += `<p>${student.Groet()}</p>`
    document.body.innerHTML += `<p>Uren per vak: ${student.BrekenUrenPerVak()}</p>`
    document.body.innerHTML += `<p>${student.studentVerjaardag()}</p>`
    document.body.innerHTML += `<hr>`
}
