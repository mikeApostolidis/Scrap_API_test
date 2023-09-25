const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

app.listen(port,()=>console.log(`ITS ALIVE http://localhost:${port}`));



app.get('/tshirt', (req,res)=>{
    res.status(200).send({
        tshirt: 'red',
        size: 'large'
    });
});

app.post('/tsheirt/:id', (req,res)=>{
    const { id } = req.params;
    const{ logo } = req.body;
    if(!logo){
        res.status(418).send({message:'We need a new logo!'})
    }
    res.send({
        tshirt: `red wtih your ${logo} and ID of ${id}`,
    });
});






