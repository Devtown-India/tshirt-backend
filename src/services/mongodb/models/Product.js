import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    stock:{
        type: Number,
        required: true
    },
    color:{
        type: String,
        required: true,
    },
    size:{
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL', 'XXL','Freesize']
    },
    image:{
        type: String,
        required: true,
    },
    stickerPrice:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
})

ProductSchema.statics = {
    isValid(id){
        return this.findById(id).then(result => {
            if(!result) throw new Error("Product not found")
        })
    }
}

export const Product = mongoose.model("Product", ProductSchema)
