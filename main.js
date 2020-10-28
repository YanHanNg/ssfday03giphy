const express = require('express');
const hbs = require('express-handlebars');
const fetch = require('node-fetch');
const withQuery = require('with-query').default;

const app =  express();
const PORT = parseInt(process.env.PORT) || 3000;
const API_KEY = process.env.API_KEY || "";

app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.status(200);
    res.type('text/html');
    res.render('first');
})

app.get('/searchGIF', async (req, res) => {
    const ENDPOINT = 'http://api.giphy.com/v1/gifs/search';
    const url = withQuery(ENDPOINT, {
        api_key: API_KEY,
        q: req.query.searchDesc,
        limit: 5,
        rating: 'pg',
        lang: 'en'
    })

    let fetchResult = await fetch(url);
    let data = await fetchResult.json();

    console.log(data);

    let x = data.data;
    let arrayGif = [];

    for(a in x)
    {
        // arrayGif.push({
        //     title: x[a].title,
        //     url: x[a].images.fixed_height.url
        // })
        arrayGif.push(x[a].images.fixed_height.url)
    }

    console.log(arrayGif);
    // let gif = fetch(url);
    // gif.then(result => {
    //     return result.json();
    // }).then(data => {
    //     let x = data;
    //     console.log(x.data);
    // })
    res.status(200);
    res.type('text/html');
    res.render('gifdisp', {
        url: url,
        gif: arrayGif
    })
})

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.redirect('/');
})


if(API_KEY) 
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT} at ${new Date()}`);
    })
else
    console.error('API Key is not set');