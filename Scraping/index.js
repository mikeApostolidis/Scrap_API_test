const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Product = require('./models/productModel');

app.use(express.json()); //midleware for json


/* app.get('/tshirt', (req,res)=>{
    res.status(200).send({
        tshirt: 'red',
        size: 'large'
    });
}); */

/* app.post('/tshirt/:id', (req,res)=>{
    const { id } = req.params;
    const{ logo } = req.body;
    if(!logo){
        res.status(418).send({message:'We need a new logo!'})
    }
    res.send({
        tshirt: `red wtih your ${logo} and ID of ${id}`
    });
}); */
//-------------------------------

//REST API
//GET ALL
app.get('/product', async(req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }catch(error){
        console.log(errors);
        res.status(500).json({message: error.message});
    }
});

//GET SINGLE
app.get('/product/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);

    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

//POST
app.post('/product', async(req,res)=>{
try{
    const product = await Product.create(req.body);
    res.status(200).json(product);

}catch(error){
    console.log(error);
    res.status(500).json({message: error.message});
}
});

//UPDATE
app.put('/product/:id', async(req,res)=>{
    try{
        const {id} = req.params;

        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message:`Cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

//DELETE
app.delete('/product/:id', async(req,res)=>{
    try{
        const {id} = req.params;

        const product = await Product.findByIdAndDelete(id, req.body);
        if(!product){
            return res.status(404).json({message:`Cannot find any product with ID ${id}`})
        }
        res.status(200).json("OK");
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
});




mongoose.connect('mongodb+srv://admin:sLP0maBlTzHu7JBG@testapi.8vpts5d.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to MongoDB');
    app.listen(port,()=>console.log(`ITS ALIVE http://localhost:${port}`));
    
}).catch((error)=>{
    console.log(console.error);
})






