// const express = require('express'); 
import express from 'express';
const app = express();
const port = 3000;
import cors from "cors";

//middleware
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is ready");
}); 

app.listen(port, () => {
    console.log("Server started at http://localhost:3000" );
});