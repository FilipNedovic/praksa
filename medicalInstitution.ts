// Karakteristike sistema zdravstvene ustanove su:
// - Doktor (ime, prezime, specijalnost) ima više pacijenata (ime, prezime, jmbg, broj zdravstvenog kartona).
// - Pacijent moze da ima samo jednog doktora.
// - Doktor moze da zakaže laboratorijski pregled za pacijenta.
// - Svaki laboratorijski pregled ima datum i vreme kada je zakazan
// - Tipovi laboratorijskog pregleda su:
//   - krvni pritisak (gornja vrednost, donja vrednost, puls)
//   - nivo šećera u krvi (vrednost, vreme poslednjeg obroka)
//   - nivo holesterola u krvi (vrednost, vreme poslednjeg obroka)

// Napraviti simulacionu skriptu koja radi sledeće:
// - kreirati doktora “Milan”
// - kreirati pacijenta “Dragan”
// - pacijent “Dragan” bira doktora “Milan” za svog izabranog lekara
// - doktor “Milan” zakazuje pregled za merenje nivoa šećera u krvi za pacijenta “Dragan”
// - doktor “Milan” zakazuje pregled za merenje krvnog pritiska za pacijenta “Dragan”
// - pacijent “Dragan” obavlja laboratorijski pregled za merenje nivoa šećera u krvi. Simulirati i prikazati rezultate.
// - pacijent “Dragan” obavlja laboratorijski pregled za merenje krvnog pritiska. Simulirati i prikazati rezultate.

// Dodati logovanje akcija u sistemu. Akcije logovati u fajl u formatu [datum] [vreme] [akcija].
// Primer jedne linije log fajla: [20.03.2013 19:30] Kreiran pacijent “Milan”

// Akcije koje treba da se loguju su:
// - kreiranje doktora
// - kreiranje pacijenta
// - pacijent bira doktora
// - obavljanje laboratorijskog pregleda

class Doktor {
  ime: string;
  prezime: string;
  specijalnost: string;
  pacijenti: Array<Pacijent> = [];

  constructor(ime, prezime, specijalnost) {
    this.ime = ime;
    this.prezime = prezime;
    this.specijalnost = specijalnost;

    new Loger().log(`Kreiran doktor ${this.ime}`);
  }

  zakaziPregled(pregled: Pregled, pacijent: Pacijent) {
    pacijent.pregledi.push(pregled);
  }
}

class Pacijent {
  ime: string;
  prezime: string;
  jmbg: number;
  brojKartona: number;
  izabraniLekar: Doktor;
  pregledi: Array<Pregled> = [];

  constructor(ime, prezime, jmbg) {
    this.ime = ime;
    this.prezime = prezime;
    this.jmbg = jmbg;
    this.brojKartona++

    new Loger().log(`Kreiran pacijent ${this.ime}`);
  }

  izaberiLekara(doktor: Doktor) {
    this.izabraniLekar = doktor;
    doktor.pacijenti.push(this);

    new Loger().log(`Izabran lekar ${doktor.ime} ${doktor.prezime}`);
  }

  obaviPregled(pregled) {
    let obavljenPregled = this.pregledi.find(el => el === pregled);
    return console.log(JSON.stringify(obavljenPregled));
  }
}

abstract class Pregled {
  datum: string;
  vreme: string;

  constructor() {
    let today = new Date();

    this.datum = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    this.vreme = `${today.getHours()}:${today.getMinutes()}`;
  }
}

class Secer extends Pregled {
  vrednost: number;
  vremePoslednjegObroka: Date;

  constructor() {
    const pribaviVrednost = new Helperi();
    super();
    this.vrednost = pribaviVrednost.randomBrUOpsegu(1, 7);
    this.vremePoslednjegObroka = pribaviVrednost.vremeIDatum(8);
  }
}

class Pritisak extends Pregled {
  gornjaVrednost: number;
  donjaVrednost: number;
  puls: number;

  constructor() {
    const pribaviVrednost = new Helperi();

    super();
    this.gornjaVrednost = pribaviVrednost.randomBrUOpsegu(100, 180);
    this.donjaVrednost = pribaviVrednost.randomBrUOpsegu(50, 100);
    this.puls = pribaviVrednost.randomBrUOpsegu(50, 100);

    new Loger().log('Obavljen laboratorijski pregled');
  }
}

class Holesterol extends Pregled {
  vrednost: number;
  vremePoslednjegObroka: Date;

  constructor(vremePoslednjegObroka) {
    const pribaviVrednost = new Helperi();

    super();
    this.vrednost = pribaviVrednost.randomBrUOpsegu(1, 10);
    this.vremePoslednjegObroka = vremePoslednjegObroka;
  }
}

class Loger {
  vreme: Date;

  constructor() {
    this.vreme = new Helperi().vremeIDatum();
  }

  log(akcija) {
      return console.log(`[${this.vreme}] ${akcija}`);
  }
}

class Helperi {
  randomBrUOpsegu = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  vremeIDatum = (sati?: number): Date => {
    if (sati === undefined) {
      let dateTime = new Date();
      return dateTime;
    }

    let dateTime = new Date();
    dateTime.setHours(dateTime.getHours() - sati);

    return dateTime;
  };
}


let drMilan = new Doktor("Milan", "Milanovic", "kardiolog");
let pacDragan = new Pacijent("Dragan", "Draganovic", 2501991980003);

let pregledSecera = new Secer();
let pregledPritiska = new Pritisak();

pacDragan.izaberiLekara(drMilan);
drMilan.zakaziPregled(pregledSecera, pacDragan);
drMilan.zakaziPregled(pregledPritiska, pacDragan);
pacDragan.obaviPregled(pregledSecera);
pacDragan.obaviPregled(pregledPritiska);
