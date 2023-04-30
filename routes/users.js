
	var mongoose = require('mongoose');
	var plm = require('passport-local-mongoose');

	mongoose.connect("mongodb://localhost/final");

	var userSchema = mongoose.Schema({
	  name: String,   
	  email : String,
	  dob : String,
	  phone : String,
	  pincode : String , 
	  gender : String,
	  nationality : String,
	  password : String,
	  address : String,
	  username: String,
	  password: String,
	  profilePic : {
		type : String , 
		default : "default.jpg"
	  },
	  expireAt: {
		type : Date,
		default : Date.now() + 24*60*60*1000
	  },
	   otp : String
	});

	userSchema.plugin(plm);

	module.exports = mongoose.model("user", userSchema);
