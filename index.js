import express from 'express';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
// Open locolhost:PORTNUMBER to view the below result
dotenv.config();
const app = express();
const PORT = 4000;

//local mongo URL
//const MONGO_URL = "mongodb://localhost:27017";
//const MONGO_URL = "mongodb+srv://<username>:<password>@cluster0.mt1fo.mongodb.net";
async function createConnection(){
    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect(); //returns promise
    console.log("MongoDB is connected!");
    return client;
}

const client = await createConnection();
app.use(express.json());

//similar to put,post,get,..methods
app.get('/', function (req, res) {
  res.send('Hello World!!!');
})


app.listen(PORT,()=> console.log(`Started server on Port Number: ${PORT}`));
//whatever changes we make while the server is running, it wont be reflected. 
//For that, We have to cut the server and re-run it.
//So this is a trouble to cut & re-reun the server for every changes..So to automate this install a package called nodemon
//npm i --save-dev nodemon

app.get('/movies', async function (req, res) { 
    const movies = client.db('BWE29').collection('MovieDetails').find({});
    console.log(movies);
    console.log(req.query); //if we do have any query, to be considered. ex: ?rating=8
    const {rating} = req.query;
    console.log(rating);
    //const movie = movies.filter((movie) => movie.rating=== +rating); // filter returns array
    //const movie = movies.find((movie) => movie.id===id); // find returns the first matching element
    const movie = await client.db('BWE29').collection('MovieDetails').findOne({rating:+rating});
    rating ? res.send(movie) : res.send(movies);
})

app.post('/movies', async function (req, res) { 
    const newMovies = req.body;
    console.log(newMovies);
    const result = await client.db('BWE29').collection('MovieDetails').insertMany(newMovies);
    res.send(result);
})

app.delete('/movies/:id', async function (req, res) { 
    
    const result = await client.db('BWE29').collection('MovieDetails').delete(newMovies);
    res.send(result);
})

app.get('/movies/:id', async function (req, res) { 
    console.log(req.params);
    const {id} = req.params;
    console.log(id);
    //const movie = movies.filter((movie) => movie.id===id); // filter returns array
    //const movie = movies.find((movie) => movie.id===id); // find returns the first matching element
    const movie = await client.db('BWE29').collection('MovieDetails').findOne({id:id});
    console.log(movie);
    movie ? res.send(movie) : res.status(404).send("No such movie found");
})
