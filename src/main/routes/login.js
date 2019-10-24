var express = require('express');
var mustache = require('../common/mustache')
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/User')

/* GET login page */
router.get('/', async (req, res, next) => {
	if (await User.query().where({authtoken: req.session.id}).first()) {
		//User is already logged in.
		res.redirect("/course/");
  	}
  	else {
	    res.render('base_template', {
			title: "Login",
			body: mustache.render('login'),
			linkblue_username: "Nobody."
		})
  	}
})

/* POST login page */
router.post('/', async (req, res, next) => {
	let user = await User
		.query()
		.where({linkblue_username: req.body.username})
		.first()
	if (user && await bcrypt.compare(req.body.password, user.passwordhash)) {
		//Authentication successful
		//Update the user's session ID in the database
		
		let affected = await User
			.query()
			.patch({authtoken : req.session.id})
			.where({linkblue_username: req.body.username});
		console.log(user.id);
		//Redirect the user to their course page
		res.redirect(302, '/course/');
	}
	else {
		res.write("Bad login for: " + req.body.username);
		res.redirect(302, '/login/');
	}
});

router.post('/signup', async (req, res, next) => {
	if (/^[A-Za-z0-9.]+@(?:cs.)?uky.edu$/g.test(req.body.username)) {
		try {
			await User.query()
				.insert({linkblue_username: req.body.username, passwordhash: bcrypt.hashSync(req.body.password, 10), authtoken : req.session.id})
			
			return res.redirect(302, '/course/');
		}
		catch(reason) {
			if (reason.name == "UniqueViolationError") {
				res.send(500, "Username: " + req.body.username + "already exists.");
			}
			else {
				res.send(500, "Internal error while adding user: " + reason);
			}
		}
			//res.send("Sign up not yet implemented.");
	}
	else {
		res.send("Username " + req.body.username + " must be a uky email")
	}
	
})


module.exports = router;
