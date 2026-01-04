import dotenv from "dotenv";
import express, {Application, Request,Response}  from "express";
import bodyParser from "body-parser";
import { connectDatabase } from "./database/mangodb";
import { PORT } from "./configs";
import authRouter from "./routes/auth.routes"; 
import { success } from "zod";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/auth",authRouter);
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
