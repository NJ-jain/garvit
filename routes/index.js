var express = require('express');
var router = express.Router();
var multer = require("multer")
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local");
var sendmail = require("../routes/nodemailer");
var say = require('say');


passport.use(new localStrategy(userModel.authenticate()));

router.get('/forget', function (req, res, next) {
  res.render('forget');
});


router.post('/reset', async function (req, res) {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    let rn = Math.floor(Math.random() * 1000000)
    sendmail(user.email, rn, user._id).then(async function () {
      user.otp = rn;
      user.expiresAt = Date.now() + 24 * 60 * 1000;
      await user.save();
      res.render("goToEmailPage");
    })
  }
  else {
    res.send("not exist!");
  }
});


router.get('/reset/password/:id/:otp', function (req, res, next) {
  userModel.findOne({ _id: req.params.id }).then(function (user) {
    if (user.expiresAt < Date.now()) {
      res.send(" itna dheehma be nahi chalna ta");
    }
    else {
      if (user.otp === req.params.otp) {
        res.render("resetPage" , {user});
      }

    }
  })
});



router.post('/setpassword/:id',async function (req, res, next) {
  let user = await userModel.findOne({_id : req.params.id});
  if(req.body.password === req.body.confirmpassword)
  {
    user.setPassword(req.body.password, async function(err, user){ 
      await user.save();
      res.send("ho gya");
    })
  }
});



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register');
});

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/profile')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.floor(Math.random()*10000000000) + file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage }) 
 
router.post('/fileimage', isLoggedIn, upload.single('image'),async function (req, res, next) {
 let loggedInUser =  await userModel.findOne({username : req.session.passport.user})
 loggedInUser.profilePic = req.file.filename ;
 await loggedInUser.save();
 res.redirect(req.headers.referer);
})


//paste code for registering user

router.post("/register", function (req, res) {
  
  const userData = new userModel({
    name: req.body.name,
    username: req.body.username,
    email : req.body.email,
    dob : req.body.dob,
    phone : req.body.phone,
    pincode : req.body.pincode,
    gender : req.body.gender,
    address : req.body.address,
    nationality : req.body.nationality
  })
  userModel.register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect("/index");
      })
    })
    .catch(function (err) {
      console.log(err);
      res.redirect("/login");
    })
});

//paste code for login

router.post("/login", passport.authenticate('local', {
  successRedirect: "/index",
  failureRedirect: "/login"
}), function (req, res) { })

//paste code for logout

router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) throw err;
    res.redirect("/login")
  });
})

//code for /index route

router.get("/index", isLoggedIn, async function (req, res) {
  var foundUser = await userModel.findOne( {username :req.session.passport.user })
  var allUser = await userModel.find()
  res.render("index" , { foundUser , allUser})
}); 

//function to check if the user is logedin

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}

//make route for login page

router.get("/login", function (req, res) {
  res.render("login");
})


router.get("/chat/:name", isLoggedIn, async function (req, res , next)  {
  var foundUser = await userModel.findOne( {username :req.session.passport.user })
  var allUser = await userModel.find()
  // var name = req.params.name;
  var name = await userModel.findOne({username : req.params.name})
    // console.log(name.profilePic);
  res.render("chat" , { foundUser , allUser , name})
})


router.get("/check", async function (req, res) {
  var allUser = await userModel.find()
  res.json( {allUser });
});
router.get("/names/:message/:username" , async function (req , res ){
  var fullname = await userModel.findOne({username : req.params.username})

   say.speak ("message from "  +  fullname.name + " and the message is " + req.params.message  )
  
})

router.get("/say/:message" , async function (req , res ){

   say.speak ( " Recived a private message and the message is " + req.params.message  )
  
})

router.get("/list/:username" , async function(req , res){
  var realname = await userModel.findOne({username : req.params.username});
  res.json({realname});
})

//make login.ejs

//make a form, set its action to /login method post
// take username, password
// add input type submit


//make a /register route


//make register.ejs
// take username, password & name
// add input type submit



module.exports = router;
