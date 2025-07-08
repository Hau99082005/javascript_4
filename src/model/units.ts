import mongoose, { Schema } from "mongoose";


const UnitsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    } 
}, {timestamps: true})

const Units = mongoose.models.Units || mongoose.model("Units", UnitsSchema);
export default Units;