import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
    products: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity:{
            type: Number,
            default: 1
        }
    }],
    total: {
        type: Number,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['created', 'paid', 'shipped','delivered','cancelled'],
    }
})

OrderSchema.pre("save", async function(next){
    try {
        console.log(this)
        //this will correspond to the product
        // update the stock values
    } catch (error) {
        next(error)
    }
})

OrderSchema.statics = {
    isValid(id){
        return this.findById(id).then(result => {
            if(!result) throw new Error("Order not found")
        })
    }
}

export const Order = mongoose.model("Order", CategorySchema)
