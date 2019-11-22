const User = import("../models/User")

module.exports.getuserfromtoken = async (token)=> {
    return await User.query().where({authtoken : req.session.id}).first()
}