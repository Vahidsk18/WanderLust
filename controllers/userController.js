const User = require('../models/user')


//create user (signup)
async function createUser(req, res) {
    res.render('users/signup')

}
async function post_createUser(req, res) {
    try {
        const { username, email, password } = req.body

        const newUser = new User({
            email,
            username,
        })
        let registeredUser = await User.register(newUser, password)
        // console.log(username, email, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to wanderlust')
            res.redirect('/login')
        })

    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/signup')
    }
}

//Login User
async function loginUser(req, res) {
    res.render('users/signin')
}
async function post_loginUser(req, res) {
    req.flash('success', 'User Login succesfully')
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)

}

//delete user
async function logoutUser(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logout Successfully")
        res.redirect('/listings')
    })
}


module.exports = {
    createUser,
    post_createUser,
    loginUser,
    post_loginUser,
    logoutUser,
}