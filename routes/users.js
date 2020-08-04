var express = require('express');
var router = express.Router();

var userModel = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/sign-up', async function(req, res, next) {

  // 1) On inspecte la bdd pour voir si le user est déjà présent
  var userExist = await userModel.findOne({email: req.body.emailFront});

  // 2) S'il ne l'est pas, on l'enregistre
  if(!userExist){
    var newUser = new userModel({
      userName: req.body.userNameFront,
      email: req.body.emailFront,
      password: req.body.passwordFront
    })

    var userSaved = await newUser.save();

  // 3) On le traque et on sauvegarde ses série avec session
    req.session.user = {
      name: userSaved.userName,
      id: userSaved._id
    }
    console.log(req.session.user)

  // 4) Si le user n'existe pas, on l'enregistre et on le redirige vers la page des séries
    res.redirect('/series')
  }else{
    res.redirect('/')
  }
 
});


router.post('/log-in', async function(req, res, next) {

  // 1) On inspecte la bdd pour voir si le user est déjà présent
  var lookForUser = await userModel.findOne({
    email: req.body.emailFront,
    password: req.body.passwordFront
  })

  // 2) Si ce n'est pas le cas, on le traque avec session
  if(lookForUser !== null){
    req.session.user ={
      name: lookForUser.userName,
      id: lookForUser._id
    }
   
    res.redirect('/series')
  
  }else{
    res.redirect('/signup')
  }
});

router.get('/log-out', function(req, res, next) {

  //On enlève le tracking et on le redirige
  req.session.user = null;

  res.redirect('/')
});


module.exports = router;
