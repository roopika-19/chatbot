import mongoose from "mongoose";
const connectToDB = async (): Promise<void> => {
    const dbUrl = process.env.MONGODB_URL;
    const object = await mongoose.connect("mongodb://127.0.0.1:27017/myapp");
    if (object) {
        console.log("connected to mongo");
    } else {
        console.log("booooooooooooooo");
    }
};
export default connectToDB;