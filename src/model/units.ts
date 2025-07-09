import mongoose, { Schema } from "mongoose";


const UnitsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, /* đảm bảo không bị trùng lặp tên đơn vị*/
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        unique: true, /* đảm bảo không bị trùng lặp tên đơn vị */
    },
    status: {
        type: Boolean,
        default: true,
    } 
}, {timestamps: true})

const Units = mongoose.models.Units || mongoose.model("Units", UnitsSchema);
export default Units;