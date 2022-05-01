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


//READ - Get all the Movies/get all the filtered movies
app.get('/movies', async function (req, res) { 
    //if we do have any query, to be considered. ex: ?rating=8
    console.log(req.query); //if there are more than 1 parameter , this will return an object => {key:value, key:value,..}
    let filter = req.query;
    if(filter.rating){
        filter.rating = +filter.rating;
    }

    //returns cursor - (Pagination) - MongoDB returns only first 20 records, to get further data-> type 'it'
    //Aswe need array of objects -> toArray()
    const allMovies = await client.db('BWE29').collection('MovieDetails').find(filter).toArray();
    
    //const movie = movies.filter((movie) => movie.rating=== +rating); // filter returns array
    //const movie = movies.find((movie) => movie.id===id); // find returns the first matching element
    res.send(allMovies);
})

//CREATE - Post the new Movie from body via request
app.post('/movies', async function (req, res) { 
    const newMovies = req.body;
    console.log(newMovies);
    const result = await client.db('BWE29').collection('MovieDetails').insertMany(newMovies);
    res.send(result);
})

//DELETE - Delete the Movie by ID
app.delete('/movies/:id', async function (req, res) { 
    const {id} = req.params;
    const result = await client.db('BWE29').collection('MovieDetails').deleteOne({id:id});
    console.log(result,id);
    result.deletedCount>0 ? res.send(result): res.status(404).send("No such movie found");
})

//READ - Get the Movie by ID
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

//UPDATE - Update/Put the Movie by ID
app.put('/movies/:id', async function (req, res) { 
    console.log(req.params);
    const {id} = req.params;
    const updatedMovie = req.body;
    const result = await client.db('BWE29').collection('MovieDetails').updateOne({id:id},{$set:updatedMovie});
    res.send(result);
})
