var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
var moment = require('moment');
var monk = require('monk');
var QRCode = require('qrcode')
var db = monk('localhost:27017/codeheat');
var col = db.get('user');
var signup = db.get('signup');
/* GET home page. */
router.get('/home', function(req,res){
  if(req.session && req.session.user){
    console.log(req.session.user);
    res.locals.user = req.session.user
    res.render('index');
  }
  else{
    req.session.reset();
    res.redirect('/');
  }
});
router.get('/pdf', function(req,res){
  res.render('pdf');
});
router.get('/', function(req,res){
  res.render('login');
});

router.get('/birthday', function(req,res){
  res.render('birthday');
})

router.get('/logout', function(req,res){
  req.session.reset();
  res.redirect('/');
});

router.get('/forgot', function(req,res){
  res.render('forgot');
});

router.get('/getuser', function(req, res) {
  col.find({}, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  })
});

router.post('/postuser', function(req,res){
  //console.log(req.body);
  col.insert(req.body, function(err,docs){
  	if(err){
  		console.log(err);
  	}
  	else{
  		//console.log(docs);
  		res.send(docs);
  	}
  })
})

router.put('/edituser/:a', function(req,res){
  console.log(req.params.a);
  console.log(req.body);
  col.update({"_id":req.params.a},{$set:req.body}, function(err,docs){
    if (err) {
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  });
});

router.delete('/deleteuser/:id', function(req,res){
  //console.log(req.params.id)
  col.remove({"_id":req.params.id}, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  });
});
//--------------------------------------signup---------------------------------------
router.post('/postsignup', function(req,res){
  var data = {
    name : req.body.name,
    email : req.body.email,
    password : cryptr.encrypt(req.body.password)
  }
  signup.insert(data, function(err,docs){
    if (err) {
      console.log(err);
    }
    else{
      res.send(docs);
    }
  });
});

router.post('/postlogin', function(req,res){
  var email1 = req.body.email;
  signup.find({'email':req.body.email},function(err,data){
  var password2 = cryptr.decrypt(data[0].password);
  var password1 = req.body.password;
  delete data[0].password;
  //console.log(data[0]);
  req.session.user = data[0];
  if(password1==password2){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(500);
  }
  });
});
//-------------------------------OTP Email--------------------------------------
router.post('/postforgot', function(req,res){
  var email = req.body.email;
  var newpassword = randomstring.generate(7);
  
  signup.update({"email":email},{$set:{"password":newpassword}});

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandy.sid4u@gmail.com',
    pass: 'jyothsna8'
  }
  });

  var mailOptions = {
    from: 'Sandeep Siva',
    to: email,
    subject: 'OTP',
    text: 'Your OTP is'+newpassword
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
      res.send(info);
    }
  });
});
//----------------------------------birthday mail--------------------------
router.post('/postbirthday', function(req,res){
  var options = { 
    method: 'POST',
    url: 'http://google.com/api/v4/?api_key="---key---"&method=sms&message='+newpassword+',&to=&sender=ADITYA' 
    };
    request(options, function (error, response, body) {
    if(error){
      console.log('error');
    }
    else{
      console.log(body);
    }
  });
  // var bdate = moment(req.body.dob).format('DD-MM');
  // console.log(bdate);
  // // var Time = moment().format('hh:mm:ss:a');
  // // console.log(Time);
  // var Date = moment().format('DD-MM');
  // console.log(Date);
  // if(bdate==Date){
  //   var transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'pm961.cse@gmail.com',
  //     pass: 'prasad961@cse'
  //   }
  //   });

  //   var mailOptions = {
  //     from: 'Sandeep Siva',
  //     to: req.body.email,
  //     subject: 'Birthday Wishes',
  //     text: 'Hi' +req.body.name+ 'Happy Birthday'
  //   };

  //   transporter.sendMail(mailOptions, function(error, info){
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent');
  //       res.send(info);
  //     }
  //   });
  // }
});
module.exports = router;
