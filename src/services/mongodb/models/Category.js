import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
})

CategorySchema.statics = {
    isValid(id){
        return this.findById(id).then(result => {
            if(!result) throw new Error("Category not found")
        })
    }
}

export const Category = mongoose.model("Category", CategorySchema)
