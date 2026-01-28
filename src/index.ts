import dotenv from "dotenv";
import express, {Application, Request,Response}  from "express";
import bodyParser from "body-parser";
import { connectDatabase } from "./database/mangodb";
import { PORT } from "./configs";
import authRouter from "./routes/auth.routes"; 
import consumerProfileRouter from "./routes/consumer.profile.route";
import cors from 'cors'
import path from "path";

const app: Application = express();

let corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/uploads",express.static(path.join(__dirname,'../uploads')));



app.use("/api/auth",authRouter);
app.use("/api/consumer",consumerProfileRouter)
app.get("/",(req:Request,res: Response) => {
    res.status(200).json({success: true, message: "Welcome to API"})
})

async function startServer(){
    await connectDatabase();
    app.listen(
        PORT,
        ()=>{
            console.log(`Server start: http://localhost:${PORT}`)
        }

    )
}
startServer();
