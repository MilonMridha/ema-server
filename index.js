const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middle ware------------->
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6lcky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('db connected')

async function run() {

    try {
        await client.connect()
        const productCollection = client.db('emajohn').collection('products');

        app.get('/product', async(req, res)=>{
            const query = {};

            console.log('query', req.query)
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            
            const cursor = productCollection.find(query);
            let product;
            if(page || size){
                //0--->skip: 0 get: 0-10(10)
                //1---->skip: 1*10 get : 11-20(10)
                //2------>skip : 2*10 get: 21-30(10)
                 product = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                product = await cursor.toArray();
            }
            
            res.send(product);
        });

        app.get('/productcount',async (req, res)=>{
            
            const count = await productCollection.estimatedDocumentCount();
            res.send({count});
        });

        app.get('/order', (req, res) =>{
            res.send('Milon Mrida s orders')
        })


    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my ema server')
});

app.listen(port, () => {
    console.log('listening my port', port)
});