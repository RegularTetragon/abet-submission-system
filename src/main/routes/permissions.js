var express = require('express');
var mustache = require('../common/mustache')
var router = express.Router();
var user_lib = require('../lib/user')


/* POST login page */
router.get('/', async (req, res, next) => {
    let user = await user_lib.getuserfromtoken(req.session.id)
    if (user == undefined) {
        res.redirect("/login");
        return
    }
	res.render('base_template', {
        title: "Permissions",
        body: mustache.render('permissions', {status:"Permissions"}),
        linkblue_username: user.linkblue_username
    })
});

router.post('/', async (req, res, next) => {
	let user = await user_lib.getuserfromtoken(req.session.id)
    if (user == undefined) {
        res.redirect("/login");
        return
    }
	res.render('base_template', {
        title: "Permissions",
        body: mustache.render('permissions', {status:"POST not yet implemented :("}),
        linkblue_username: user.linkblue_username
    })
});

module.exports = router;