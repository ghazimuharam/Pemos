var express = require('express');
var router = express.Router();
var path = require('path');
var NewDataBase = require('../lib/Calon.js');
var DataBase = require('../lib/DataBase.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { htmltit : "Osis Election Website"});
});
router.get('/admin/tambah/calon', function(req, res, next){
  res.render('admin/calon', { 	NotificationLog : 'Please signup With UniqueCode',
		  						htmltit : "Guru Signup Page - Osis Election Website",
								title 	: "Masuk Dengan UniqueCode",
								action	: "/admin/tambah/calon"});
});


router.post('/admin/tambah/calon', function(req, res, next){
   let Name = req.body.name;
   let Vision = req.body.vision;
   let Img		= req.body.img;
console.log(req.body);
   var NewCalon = new NewDataBase.Calon({
   	Name : Name,
   	Vision : Vision,
   	Img : Img,
    Jlh : 0
   });
   NewCalon.save(function(err, SavedObj) {
   	if(err) console.log(err);
   	console.log(SavedObj);

   res.send(req.body);
   });
});


router.get('/vote/id/:id', function(req, res, next) {
  if(!req.session.user){
      res.redirect('/');
  }
	var tambah = 1;
	if(req.session.user == 'guru'){
		tambah = 10;
	}
  DataBase.User.find({ UniqueCode : req.session.name },function(err, cb) {
    if(err){ console.log(err)}
    if(cb[0]["Vote"] == 0){
        req.session.destroy();
        res.redirect('/guru/login');
    }else{
          NewDataBase.Calon.find( { _id : req.params.id }, function(err, cb) {
          if(err){ console.log(err)}
          var total = cb[0]["Jlh"] + tambah;
              NewDataBase.Calon.updateOne( { _id : req.params.id }, { $set : { Jlh : total}} , function(err, cb) {
                if(err){ res.send(err) }
                console.log(cb);
                      DataBase.User.updateOne({ UniqueCode : req.session.name }, { $set : { Vote : 0 } } , function(err, cb) {
                      if(err){ console.log(err)}
                          req.session.destroy();
                          res.render('end/selesai', {   htmltit : "Thanks Page - Osis Election Website",
                                                    title   : "Thanks For Your Vote",
                                                    action  : "/"});
                      })
              })
            })
      }
   })
});

router.get('/admin/tambah/pemilih', function(req, res, next) {
	res.render('signup', { 	NotificationLog : 'UniqueCode Generator',
		  						htmltit : "Signup Page - Osis Election Website",
								title 	: "Daftarkan UniqueCode",
								action	: "/admin/tambah/pemilih"});
});
router.post('/admin/tambah/pemilih', function(req, res, next){
		let UniqueCode = req.body.password;
		let Type 	   = req.body.type;
		DataBase.User.find({ UniqueCode : UniqueCode }, function(err, CheckObj){
			if(err) console.log(err);
			var NewCheckObj = CheckObj;
			if(NewCheckObj.length > 0){
				console.log('Cannot Create Multiple UniqueCode');
				res.send('User Found In DataBase');
			}else{
				var NewLogDet = new DataBase.User({
			UniqueCode : UniqueCode,
			Type 	   : Type,
			Vote	   : 1
			});
			NewLogDet.save(function(err, SavedObject){
			if(err) console.log(err);
			console.log(SavedObject);
			res.json(SavedObject);
			});
			}
		});
});

module.exports = router;
