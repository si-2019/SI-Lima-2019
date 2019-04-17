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