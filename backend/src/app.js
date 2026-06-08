import dotenv from 'dotenv';
import express from 'express';

dotenv.config({
    path: "./.env"
});

const app = express();


app.get('/', (req,res) => {
    res.send("Hello World");
});


export default app;

