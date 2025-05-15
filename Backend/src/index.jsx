const express = require('express');
const app = express();
const cors = require('cors');
const port=5000;

app.use(cors);

app.get('/login',(req,res)=>{
    console.log("login api")
})

app.listen(port,()=>{
    console.log("server started...");
});
  