import app from "./app";
import { PORT } from "./configs";
import { connectDatabase } from "./database/mangodb";

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
