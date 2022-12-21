const express = require('express');
const router = new express.Router();
const admin = require('../models/admin');
const user = require('../models/user');
const session = require('cookie-session');
const async = require('async');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
var twilio = require('twilio');
const accountSid = "ACf8ce11fd6f2e82f9f0004399dead830e";
const authToken = "89dad20ec1c189cbeb9db75d2f51ac93";
const otpGenerator = require('otp-generator')
var client = new twilio(accountSid, authToken);
var fs = require('fs');
const multer = require('multer');
const AWS = require("aws-sdk");
const keys = require('../config/config');
var sess = '';
var assigndata = {};
const idoapp = require('./../models/idoapp');

router.get('/dashboard', function (req, res) {
    if (req.session.adminid_b == null) {
        res.redirect('/login');
    } else {
        res.redirect('/userdetails');
    }
});

//login
router.post('/login', function (req, res) {
    var pdata = req.body;
    if (req.session.adminid_b == null) {
        if (pdata.ad_email != "" || pdata.ad_pass != "") {
            try {
                admin.findOne({ email: pdata.ad_email }, function (err, data) {
                    if (err || data == null) {
                        res.json({ status: 3, message: "Invalid Email" });
                    } else {
                        var bytes1 = CryptoJS.AES.decrypt(data.password.toString(), "iso");
                        var decryptedData = (bytes1.toString(CryptoJS.enc.Utf8));
                        console.log(decryptedData, 'decryptedData');

                        if (decryptedData == pdata.ad_pass) {
                            req.session.adminemail_b = data.email;
                            req.session.adminid_b = data._id;

                            res.json({ status: 2, message: "You have loggedin successfully." });
                        }
                        else if (decryptedData !== pdata.ad_pass) {
                            res.json({ status: 5, message: "Invalid Password Or Email" });
                        }
                        else {
                            res.json({ status: 5, message: "Your status is de-activated, please contact site admin." });
                        }
                    }
                });
            }
            catch (err) {
                res.json({ status: 0, message: err });
            }
        }
        else {
            res.json({ status: 0, message: "You must enter all fields" });
        }
    } else {
        res.json({ status: 4, message: "You have already loggedin." });
    }
});


router.post('/user-registration', function (req, res) {
    var pdata = req.body;
    user.findOne({ email: pdata.emailAddress }, (err, User) => {
        if (User) {
            res.send({ 'status': 2, message: "User already registerd" })
        } else {

            var encrypted = CryptoJS.AES.encrypt(pdata.password, 'coinbacker').toString();

            user.create({ "phone_number": pdata.phone, "email": pdata.emailAddress, "password": encrypted, "created_date": new Date() }, function (uperr, resUpdate) {

                if (!uperr) {
                    res.json({ 'status': 1, message: "Successfully Registered, Please login now." })
                }
                else {
                    console.log(uperr, "uperr");
                    res.json({ 'status': 0, message: "Some error was occurred while updating details" })
                }

            });
        }
    })
});

router.get('/', function (req, res, next) {
    if (req.session.adminid_b == null) {
        res.render('login');
    } else {
        res.redirect('/userdetails');
    }
});

router.get('/admin_logout', function (req, res) {
    req.session = null;
    res.redirect('/');
});

var storage = multer.memoryStorage({
    destination: function(req, file, callback) {
      callback(null, "");
    }
});

var profileupload = multer({ storage: storage }).fields([
    { name: "profileimage", maxCount: 1 }
]);  

router.post('/idoapplication',profileupload,function(req,res,next) { 
    var pdata = req.body;
    var filesdata = req.files;
    var approved = "notapproved";
    var idoappsave = new idoapp ({
      name:pdata.name,
      email:pdata.email,
      projectname:pdata.projectname,
      description:pdata.description,
      teams:pdata.teams,
      investors:pdata.investors,
      smartaudit:pdata.smartaudit,
      whitepaperlink:pdata.whitepaperlink,
      websitelink:pdata.websitelink,
      githublink:pdata.githublink,
      telegramgroup:pdata.telegramgroup,
      telegramlink:pdata.telegramlink,
      tokensupply:pdata.tokensupply,
      initialsupply:pdata.initialsupply,
      tokenprice:pdata.tokenprice,
      hardcapvalue:pdata.hardcapvalue,
      softcapvalue:pdata.softcapvalue,
      blockchainvalues:pdata.blockchainvalues,
      contractaddress:pdata.contractaddress,
      status:approved,
      startdate:pdata.startdates,
      enddate:pdata.enddates
    });
    idoappsave.save(function(err,result){
      if(err) {
        res.json({
          status: false,
          message: "Some error was occurred"
        });
      } else {
        res.json({
          status: true,
          message: "successfully saved"
        });
      }
    })
})


router.get('/getido',function(req,res,next) {
    async.parallel({
      idoapp: function(cb) {
        idoapp.find({status:"Approved"}).exec(cb)
      }
    }, function(err,results){
        console.log(results);
      res.json(results);
    })
})


router.get('/userdetails', function (req, res, next) {
    if (req.session.adminid_b == null) {
        res.redirect('/');
    } else {
        async.parallel({
            idoapp: function (cb) {
                idoapp.find({}).sort({ _id: 'desc' }).exec(cb)
            }
        }, function (err, results) {
            if (err) return callback(err);
            try {
                assigndata['idoapp'] = results.idoapp;
                res.render("userdetails", { "data": assigndata });
            } catch (err) {
                return callback(new Error('Error'));
            }
        });
    }
});


router.post('/idostatus', function (req, res, next) {
    var id = req.body.id
    var status = req.body.status;
    console.log(id,status);
    if (req.session.adminid_b == null) {
        res.redirect('/');
    } else {
        async.parallel({
            idoapp: function (cb) {
                idoapp.findOne({ _id: id }).sort({ _id: 'desc' }).exec(cb)
            }
        }, function (err, results) {
            console.log(results,"results")
            idoapp.findOneAndUpdate({ _id: id },
                { "$set": { "status": status } }
            ).exec(function (uperr, resUpdate) {
                if (!uperr) {
                    res.json({ 'status': true, message: "Status Updated" })
                }
                else {
                    console.log(uperr, "uperr");
                    res.json({ 'status': false, message: "Some error was occurred while updating details" })
                }
        })
    });
    }

});


module.exports = router;
