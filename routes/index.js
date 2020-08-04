var express = require('express');
var router = express.Router();

var request = require('sync-request');

var serieModel = require('../models/series');

/* GET LOGIN. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

//ROUTES LOGIN/SIGNUP INTERNES

router.get('/signup-register', function(req, res, next) {
  res.render('signup');
});

router.get('/login-register', function(req, res, next) {
  res.render('login');
});



router.get('/series',  async function(req, res, next) {

  if(req.session.user == null){
    res.redirect('/')
  } else{
    var serieList = await serieModel.find();
  }
  
  res.render('series', {serieList});
});

router.post('/search-series', async function(req, res, next) {

  var dataSeries = request("GET", `http://api.tvmaze.com/singlesearch/shows?q=${req.body.serieFront}`)
  var dataSeriesJson = JSON.parse(dataSeries.body)

  var exist = await serieModel.findOne({
    name: req.body.serieFront.toLowerCase()
  });

  if(exist == null && dataSeriesJson.name){

    var newSerie = new serieModel({
      img: dataSeriesJson.image.original,
      name: req.body.serieFront,
      langue: dataSeriesJson.language,
      genres: dataSeriesJson.genres[0],
      status: dataSeriesJson.status,
      officialSite: dataSeriesJson.officialSite,
      summary: dataSeriesJson.summary,
      rating: dataSeriesJson.rating.average,
      
  
  
    })
  
    await newSerie.save();
  }


 serieList = await serieModel.find();

res.render('series', {serieList});
});


router.get('/delete-serie', async function(req, res, next) {

  await serieModel.deleteOne({
    _id: req.query.id
  })

  var serieList = await serieModel.find();

  res.render('series', {serieList});
});





module.exports = router;
