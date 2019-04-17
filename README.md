# SI-Lima-2019
# Tim Lima

## Modul: 'Potvrde'

## Članovi tima:
- Kovačević Faris (vođa tima)
- Džigal Džemil
- Zukorlić Fatih
- Mešić Ajla
- Mojsilović Dajana
- Hanjalić Naida
- Malkoč Ahmed
- Ćesko Ammar

## Opis modula
Ovaj modul omogućava studentu da prijavi zahtjev za željenu
potvrdu, dokument ili uvjerenje. Svi dokumenti se izdaju od
strane studentske službe fakulteta. Od strane korisnika koji je
student šalje se zahtjev, a obrada zahtjeva se vrši od strane
korisnika koji je zaposlenik studentske službe. Modulom se
pokusava riješiti dosadašnja praksa slanja zahtjeva te dodatnog
potpisivanja na studentskoj službi, čime se gubi smisao slanja
zahtjeva kroz informacioni sistem. Dio modula koji rješava
funkcionalnosti potrebne studentskoj službi podrazumijeva
uzimanje podataka iz baze podataka te popunjavanja
pripremljenog template-a tim podacima, a nakon toga
generisanje .pdf dokumenta. Dio modula koji se odnosi na
studente obavještava kada je njegov zahtjev primljen, daje uvid
u kojoj fazi procedure je trenutno njegov zahtjev i kada je
njegova potvrda (dokument, uvjerenje) spremna za
preuzimanje. Takodjer, student ima uvid u broj preostalih
potvrda koje nije dužan platiti, te cijenu koju plaća za potvrde
kada predje taj limit. Broj besplatnih potvrda u toku semestra
odredjuje studentska služba, a naravno i cijenu onih koje nisu
besplatne.

### Objašnjenje file-ova na branchu
Ovdje se nalazi glavni backend za potvrde (index.js).

Ako iko bude radio "nadogradnju" backenda u smislu app. ruta kao i modela, neka na ovaj branch ga pošalje.

Baza:
Povezano sa bazom na remotemysql.com, podaci za bazu su:
Link do baze: https://remotemysql.com/phpmyadmin/
Username: TYQcLL35gV
Database: TYQcLL35gV
Password: BLysSj9ZrP

Model:
korisnik, predmet, svrhaPotvrde, zahtjevZaPotvrdu

Veze:
db.js ima definisane veze za:
	korisnik:predmet (m:n), odn. korisnik ima više predmeta i predmet ima više korisnika (studenata)
	korisnik:zahtjevZaPotvrdu (1:n), odn. korisnik ima više zahtjeva za potvrdu
	zahtjevZaPotvrdu:svrha (1:1), odn. zahtjev za potvrdu ima jednu i samo jednu svrhu.
