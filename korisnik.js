const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const korisnik = sequelize.define("Korisnik",{
        idOdsjek:Sequelize.INTEGER,
        idUloga:Sequelize.INTEGER,
        ime:Sequelize.STRING,
        prezime:Sequelize.STRING,
        datumRodjenja:Sequelize.DATE,
        jmbg:Sequelize.STRING,
        email:Sequelize.STRING,
        mjestoRodjenja:Sequelize.STRING,
        kanton:Sequelize.STRING,
        drzavljanstvo:Sequelize.STRING,
        telefon:Sequelize.STRING,
        spol:Sequelize.BOOLEAN,
        imePrezimeMajke:Sequelize.STRING,
        imePrezimeOca:Sequelize.STRING,
        adresa:Sequelize.STRING,
        username:Sequelize.STRING,
        password:Sequelize.STRING,
        linkedin:Sequelize.STRING,
        website:Sequelize.STRING,
        fotografija:Sequelize.BLOB,
        indeks:Sequelize.STRING,
        ciklus:Sequelize.STRING,
        semestar:Sequelize.STRING,
        titula:Sequelize.STRING
    },
    {freezeTableName:true,
        timestamps:false}
    )
    return korisnik;
};
