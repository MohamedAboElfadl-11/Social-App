import mongoose from "mongoose";
import { ReactsType } from "../../Constants/constatnts.js";

const reactSchema = new mongoose.Schema({
    reactOnId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'omModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['posts', 'comments']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    reactType: {
        type: String,
        enum: Object.values(ReactsType)
    }
}, { timestamps: true })

const ReactsModel = mongoose.Schema.reacts || mongoose.model('reacts', reactSchema);

export default ReactsModel