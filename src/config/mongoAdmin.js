import mongoose from "mongoose";
import dotenv from "dotenv";

//This helps to load the variables from .env file into process.env
dotenv.config();

const mongoAdmin = async () => {
    try {
        // Connection Event Listeners
        mongoose.connection.on("connected", ()=>{
        console.log("Mongoose connected to DB!!");
        });

        mongoose.connection.on("error", (err)=>{
        console.log(`Mongoose Connection Error: ${err}`);
        });

        mongoose.connection.on("disconnected", ()=>{
        console.log("Mongoose Disconnected!!");
        });

        //Connecting DB
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Mongoose Connected Successfully: ${conn.connection.host}`);
        
        //Close the Mongoose connection when the Node process ends
        process.on("SIGINT", async ()=> {
            await mongoose.connection.close();
            console.log("Mongoose Connection is closed through app termination!!");
            process.exit(0);
        })

    } catch (error) {
        console.error(`Mongoose Connection Error: ${error}`);
        process.exit(1);
    }
}
export default mongoAdmin;