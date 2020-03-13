var express = require('express');
var router = express.Router();
var path = require('path');
var DataBase = require('../lib/DataBase.js');
var NewDataBase = require('../lib/Calon.js');

/* GET home page. */
router.get('/login', function(req, res, next) {
		if(req.session.user == 'guru'){ res.redirect('/guru/dashboard'); }
  		res.render('login', { 	NotificationLog : "Please Login With UniqueCode",
		  						htmltit : "Guru Login Page - Osis Election Website",
								title 	: "Masuk Dengan UniqueCode",
								action	: "/guru/login",
								type	: "guru"});
});
router.get('/', function(req, res, next) {
	res.redirect('/guru/login');
});

router.post('/login', function(req, res, next){
	  	var UniqueCode 		= req.body.password;
	  	var Type			= req.body.type;
		console.log(req.body);
		DataBase.User.find({ UniqueCode : UniqueCode, Type : Type }, function(err, foundData){
		if(err) { console.log(err); }
		if(foundData.length == 0){
			res.render('login', { 	NotificationLog : "User Not Found",
			  						htmltit : "Guru Login Page - Osis Election Website",
									title 	: "Masuk Dengan UniqueCode",
									action	: "/guru/login",
									type	: "guru"})
		}else{
			if(foundData[0]["Vote"] == 0){
			res.render('login', { 	NotificationLog : "You Have Voted!",
			  						htmltit : "Guru Login Page - Osis Election Website",
									title 	: "Masuk Dengan UniqueCode",
									action	: "/guru/login",
									type	: "guru"})
			}else{
			req.session.user = Type;
			req.session.name = UniqueCode;
			res.redirect('/guru/dashboard');
			}
		}
	});
});

router.get('/logout', function(req, res, next){
		req.session.destroy();
		res.redirect('/guru/login')
});

router.get('/dashboard', function(req, res, next){
		if(!req.session.user){
			res.redirect('/guru/login');
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
			res.render('panel/dashboard', { users : ObjNew, calons : CalonData, htmltit: "Guru Pilih Page - Osis Election Website" });
			});
			})
});


module.exports = router;
