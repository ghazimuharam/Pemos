var express = require('express');
var router = express.Router();
var path = require('path');
var DataBase = require('../lib/DataBase.js');
var NewDataBase = require('../lib/Calon.js');

/* GET home page. */
router.get('/login', function(req, res, next) {
		if(req.session.user == 'siswa'){ res.redirect('/siswa/dashboard'); }
  		res.render('login', { 	NotificationLog : "Please Login With UniqueCode",	
		  						htmltit : "Siswa Login Page - Osis Election Website",
								title 	: "Masuk Dengan UniqueCode",
								action	: "/siswa/login",
								type	: "siswa"});
});
router.get('/', function(req, res, next) {
	res.redirect('/siswa/login');
});

router.post('/login', function(req, res, next){
	  	var UniqueCode 		= req.body.password;
	  	var Type			= req.body.type;
		console.log(req.body);
		DataBase.User.find({ UniqueCode : UniqueCode, Type : Type }, function(err, foundData){
		if(err) { console.log(err); }
		if(foundData.length == 0){
			res.render('login', { 	NotificationLog : "User Not Found",	
			  						htmltit : "Siswa Login Page - Osis Election Website",
									title 	: "Masuk Dengan UniqueCode",
									action	: "/siswa/login",
									type	: "siswa"})
		}else{
			if(foundData[0]["Vote"] == 0){
			res.render('login', { 	NotificationLog : "You Have Voted!",	
			  						htmltit : "Siswa Login Page - Osis Election Website",
									title 	: "Masuk Dengan UniqueCode",
									action	: "/siswa/login",
									type	: "siswa"})
			}else{
			req.session.user = Type;
			req.session.name = UniqueCode;
			res.redirect('/siswa/dashboard');
			}
		}
	});
});

router.get('/logout', function(req, res, next){
		req.session.destroy();
		res.redirect('/siswa/login')
});

router.get('/dashboard', function(req, res, next){
		if(!req.session.user){
			res.redirect('/siswa/login');
		}
		req.session.save(function(err, dataSess){
			if(err) console.log(err);
			console.log(req.session);
		});
		DataBase.User.find({ UniqueCode : req.session.name },function(err, foundData){
			if(err) { console.log(err); }
			NewDataBase.Calon.find({}, function(err, CalonData){
			if(err) { console.log(err); }
			var ObjNew = foundData;
			var CalonData = CalonData
			res.render('panel/dashboard', { users : ObjNew, calons : CalonData, htmltit: "Siswa Pilih Page - Osis Election Website" });
			});
			})
});
router.get('/new', function(req, res, next) {
	res.render('signup', { 	NotificationLog : 'Please signup With UniqueCode',	
		  						htmltit : "Siswa Signup Page - Osis Election Website",
								title 	: "Masuk Dengan UniqueCode",
								action	: "/siswa/new"});
});
router.post('/new', function(req, res, next){
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
