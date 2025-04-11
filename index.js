const express =  require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const {router} =  require('./routes/router');
dotenv.config();        
const app = express();
app.use(cors());
app.use(express.json());
app.use('/',router);
app.listen(process.env.PORT, ()=>{
    console.log("Server started at Port ", process.env.PORT);
})
