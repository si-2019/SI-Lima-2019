module.exports = function(app, con) {
    /* ovdje se pišu zahtjevi npr.
      app.get('/svrha', function(req, res) {
        res.send('lima - potvrde')  
      })
    */
    
    app.get('/svrha', function(req, res){
      res.send('nesto')
    })
    
    con.query('select * from SvrhaPotvrde', (err, res) => {
      console.log(err, res[0].naziv)
  })
  

}