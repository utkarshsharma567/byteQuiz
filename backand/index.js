import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from "./config/db.js";
import userRouter from './routes/user.routes.js';
import resultRouter from './routes/result.routes.js';


const app = express();
const port = process.env.PORT || 4000;

//middlware
app.use(cors());
app.use(express.json());

// connect database
connectDB();

//ROUTES
app.get('/',(req,resp)=>{
    resp.send("Hello adarsh and diksha sharma api is running");
})

app.use('/api/user',userRouter)
app.use('/api/result',resultRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`); // The completed line
});