const User = require("../models/User")

module.exports.getuserfromtoken = async (token)=> {
    return await User.query().where({authtoken : token}).first()
}