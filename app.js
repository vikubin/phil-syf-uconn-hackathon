// App

// Requires
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

// Where the magic happens - My scripts
const page = require('./scripts/page');

// Static Content
app.use('/s',express.static('./static'));

// Parse Page Requests
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// For google's health checks
app.get('/_ah/*', (req,res) => {
    res.status(404).send();
});

// Log Requests
app.use((req,res,next)=>{
    console.log('Request => Method:', req.method, ' Path:', req.path, ' Body:', req.body, ' Params:', req.params, ' Query:', req.query);
    next();
});

// Handlebars
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', exphbs( {
    extname: '.html',
    defaultView: 'index',
    defaultLayout: 'external',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

// Landing Page
app.get('/', (req,res) => {
   page.index(req,res);
});

// Internal Routes
const internal_router = require("./routes/internal_router");
app.use("/i",internal_router);

// 404
app.get('/*', (req,res) => {
    page.error(req,res,"404");
});


// For local testing
if(process.env.COMPUTERNAME === "DESKTOP-8HR6D8D"){
    process.env.PORT = "8080";
}

// GCLOUD
const server = app.listen(process.env.PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Phil's stuff - listening at http://${host}:${port}`);
});