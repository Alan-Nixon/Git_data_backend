import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI + "").then(() => {
    console.log("connected mongodb")
}).catch((err) => {
    console.log(err ?? "Error occured while connecting")
})