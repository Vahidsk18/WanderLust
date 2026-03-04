require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;


//middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(cookieParser());

const { MongoDB } = require('./config')
const ExpressError = require('./utils/ExpressError')
const listingsRoute = require('./routes/list')
const reviewRoute = require('./routes/review')
const userRoute = require('./routes/userRoute')
const User = require('./models/user')

//DB 
MongoDB().then(() => console.log("Db connected"))
    .catch(err => console.log(err));


const store = MongoStore.create({
    mongoUrl: process.env.MongoUrl,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600
})

store.on("error",(err)=>{
    console.log("error in mongo store",err)
})

const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

//for session
app.use(session(sessionOptions))
app.use(flash());

//for
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    // console.log("Curruser",req.user)
    next()
})


//routes
app.use('/', listingsRoute)
app.use('/', reviewRoute)
app.use('/', userRoute)


//for error handling middlewares
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render('error', { message })
})

let PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`running,${PORT}`);
})