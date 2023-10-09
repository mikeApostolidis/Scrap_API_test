const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const Book = require('./models/bookModel');

app.use(express.json()); //midleware for json

//scraping
const axios = require("axios");
const cheerio = require("cheerio");
const j2cp = require("json2csv").Parser;
const fs= require("fs");
var request = require('request');

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
const Sequential_Art="https://books.toscrape.com/catalogue/category/books/sequential-art_5/index.html";
const baseUrl="https://books.toscrape.com/catalogue/category/books/sequential-art_5/";
const book_data= [];



async function getBooks(url){
    try{

        const response = await axios.get(url);    
        const $=cheerio.load(response.data);
    


        const books= $("article");
        books.each(function() {
            title = $(this).find("h3 a").text();
            price = $(this).find(".price_color").text();
            stock = $(this).find(".availability").text().trim();

            book_data.push({title,price,stock});
        });
        //console.log(book_data);


        if($(".next a").length>0){
            next_page = baseUrl + $(".next a").attr("href");
            //console.log(next_page);
            getBooks(next_page);
        }
        else{
            
            const parser = new j2cp();
            const csv = parser.parse(book_data);
            fs.writeFileSync("./books.csv", csv);

            var json = JSON.stringify(book_data);
            fs.writeFileSync("./ScrapApi.json", json);
           // console.log(json);
        }
        

        //const scrapedDataJSON = JSON.stringify(book_data)
        //console.log(scrapedDataJSON);
    }
    catch(error){
        console.error(error);
    }
    return json;
}

getBooks(Sequential_Art);
//-------------------------------------------




/* // import data to MongoDB
const importData = async () => {
    try {
      await Book.create(data)
      console.log('data successfully imported')
      // to exit the process
      process.exit()
    } catch (error) {
      console.log('error', error)
    }
  }

  importData(); */
  //-------------------------

//REST API
//GET ALL
app.get('/product', async(req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }catch(error){
        console.log(error);
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

//POST scrap
app.post('/product', async(req,res)=>{
    try{
        const book = await Book.create(req.body);
        ScrapApi.save(body);
        res.status(200).json(book);
    
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




//mongoose.connect('mongodb+srv://admin:sLP0maBlTzHu7JBG@testapi.8vpts5d.mongodb.net/Node-API?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://ScrapMaster:wY5ZdIOBaEy2FdL9@scrapcluster.wije38c.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to MongoDB');
    app.listen(port,()=>console.log(`ITS ALIVE http://localhost:${port}`));
    
}).catch((error)=>{
    console.log(console.error);
})






