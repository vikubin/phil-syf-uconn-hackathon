// App

// Requires
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

// Parse Requests
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
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

// Landing Page
app.get('/', (req,res) => {
    res.send("test");
});

// 404
app.get('/*', (req,res) => {
    utils.page.error(req,res,"404");
});


// For local testing
if(process.env.COMPUTERNAME === "DESKTOP-8HR6D8D"){
    process.env.PORT = "8080";
}

// GCLOUD
const server = app.listen(process.env.PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Slate Intel API - listening at http://${host}:${port}`);
});