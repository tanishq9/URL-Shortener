// Get the requirements
const express = require('express');
const app = express();
const cors = require('cors');
const atob = require('atob');
const btoa = require('btoa');
const mongoose = require('mongoose');
const URL = require('./models/db').URL;
const Counter = require('./models/db').Counter;

// Execute : mongod --dbpath:./data to create the required data files for running the db

var promise;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors()); // for cross orign requests !?

// Connect to the database
// mongoose.connect returns a promise
// 'mongodb://tanishqsaluja>:<tanishqsaluja9>@ds123625.mlab.com:23625/urls' 

// mongoose requires MONGODB database just as Sequelize requires MySQL database
promise = mongoose.connect('mongodb://tanishqsaluja:tanishqsaluja9@ds123625.mlab.com:23625/urls');
//'mongodb://localhost:27017');

promise.then(function(){
    // we'll initialize our counter with a starting value of 10,000 to set up the URL shortening process.
    console.log('Connected.');
    URL.remove({},function(){
        console.log('URL collection removed');
    });
    Counter.remove({},function(){
        console.log('Counter collection removed');
        // we can use either of mongoose save/insert/create to add new document in the collection
        var counter = new Counter({_id:'url_count',count:10000}) 
        counter.save(function(err,counter_id){ // if we use save then we get the id back in the callback function 
            if(err){
                return console.error(err);
            } 
            console.log('counter inserted and its value : '+counter_id);
        })
    }).catch(function(err){
        console.log("Error");
    });
})

// Render the frontend
app.use('/',express.static(__dirname+'/public'));

// POST on /shorten 
app.post('/shorten',function(req,res,next){
    console.log(req.body.url);
    var urlData = req.body.url;
    URL.findOne({url:urlData},function(err,doc){
        if(err){
            return console.error(err);
        } 
        if(doc){
            console.log('Entry found in collection.');
            res.send({
                url : urlData,
                hash : btoa(doc._id),
                status : 200,
                statusTxt : 'OK'
            });
        }else{
            console.log('Entry not found in the collection.');
            var new_url = new URL({
                url : urlData 
            });
            new_url.save(function(err){
                if(err) return console.error(err);
                res.send({
                    url: urlData,
                    hash: btoa(new_url._id),
                    status: 200,
                    statusTxt: 'OK'
                });
            });
        }
    });
})

app.get('/shorten',function(req,res){
    URL.find({},function(err,docs){
        var docsMap = {};
        docs.forEach(function(doc){
            docsMap[doc._id] = doc;
        })    
        res.send(docs);
    });
})

app.get('/:hash',function(req,res){
    var baseid = req.params.hash;
    var id = atob(baseid);
    URL.findOne({_id:id},function(err,doc){
        if(doc){
            res.redirect(doc.url);
        }else{
            res.redirect('/');
        }
    });
})

app.listen(process.env.PORT || 3333,function(){
    console.log('Server started.');
})
