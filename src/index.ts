import dotenv from "dotenv";
import express, {Request,Response}  from "express";
import bodyParser from "body-parser";

dotenv.config();

const port = process.env.PORT

const app = express();
app.use(bodyParser.json());

app.get("/",(req:Request,res: Response) => {
    res.send("Hello world maya")
})

async function startServer(){
    app.listen(
        port,
        ()=>{
            console.log(`Server start: http://localhost:${port}`)
        }

    )
}
startServer();
