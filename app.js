const express = require('express')
const path = require('path')
const app = express()
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);

const { MongoDB } = require('./config')
const Listing = require('./models/listing')

//DB 
MongoDB().then(() => console.log("Db connected"))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send("Done!!!!!")
})

//get all
app.get('/listings', async (req, res) => {
    let lists = await Listing.find({})
    res.render('index', { lists })
})
//get single list
app.get('/viewlist/:id', async (req, res) => {
    const id = req.params.id;
    let list = await Listing.findById(id);
    res.render('list', { list })
})

//create list
app.get('/listing/new', (req, res) => {
    res.render('createlist')
})
app.post('/create/new/list', async (req, res) => {
    const { title, description, image, price, location, country } = req.body;
    let list = await Listing.create({ title, description, image, price, location, country });
    res.redirect('/listings');
})

//edit & update
app.get('/editlist/:id', async (req, res) => {
    const id = req.params.id;
    let list = await Listing.findById(id);
    res.render('updatelist', { list })
})
app.put('/edit/list/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description, image, price, location, country } = req.body;
    let list = await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country }, { new: true });
    res.redirect(`/viewlist/${id}`);
})

app.get('/deletelist/:id', async (req, res) => {
    const id = req.params.id;
    let list = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})



app.listen(8000)

