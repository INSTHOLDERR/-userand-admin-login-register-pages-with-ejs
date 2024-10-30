import mongoose from "mongoose";


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
  
    password: {
        type: String,
        required: true,
        unique: false
    },
    isAdmin: {
        type: Boolean,
        default: false 
    }
});

export default mongoose.model.Users || mongoose.model("User", schema);