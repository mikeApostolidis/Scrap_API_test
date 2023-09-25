const axios = require("axios");
const cheerio = require("cheerio");
const j2cp = require("json2csv").Parser;
const fs= require("fs");
var request = require('request');



const mysql = require('mysql2');
// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'M!xalhs2341998',
  database: 'connectnodejstest'
});
// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});
// close the MySQL connection
connection.end();



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
        }

        //const scrapedDataJSON = JSON.stringify(book_data)
        //console.log(scrapedDataJSON);
    }
    catch(error){
        console.error(error);
    }
}

getBooks(Sequential_Art);

