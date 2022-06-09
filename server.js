

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const MongoClient = require('mongodb').MongoClient;


// new Promise((res, rej) => {

//   fs.readFile(
//     './credentials.json',
//     (err, data) => {
//       if (err) {
//         rej(err);
//       } else {
//         res(JSON.parse(data.toString()));
//       }
//     })
// })
//   .then(
//     () => 
MongoClient.connect(`mongodb+srv://${process.env.user}:${process.env.pw}@cluster0.5xevu.mongodb.net/?retryWrites=true&w=majority`, { useUnifiedTopology: true })
  //)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('rickandmorty-quotes');
    const quotesCollection = db.collection('quotes');
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/public', express.static('public'));
    app.use(bodyParser.json());


    //Create (POST)
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          // console.log(result);
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    //Read (GET)
    app.get('/', (req, res) => {
      quotesCollection.find().toArray()
        .then(results => {
          // console.log(results);
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error));
    })

    //Update (PUT)
    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Morty' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
          console.log(result);
          res.json('Success')
        })
        .catch(error => console.error(error))
    })

    //Delete (DELETE)
    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name },
      )
        .then(result => {
          res.json('Deleted Rick\'s Quote')
        })
        .catch(error => console.error(error))
    })

    //server
    app.listen(process.env.PORT || 3000, function () {
      console.log('listening on 3000')
    })
  })
  .catch(error => console.error(error))
