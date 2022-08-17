import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    role: {
        // 0 specifies that our user is a normal user & 1 specifies that our user is an admin
        type: Number,
        default: 0
    },
    addresses: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Address'
        }
    ]
})

UserSchema.statics = {
    isValid(id){
        return this.findById(id).then(result => {
            if(!result) throw new Error("User not found")
        })
    }
}

export const User = mongoose.model("User", UserSchema)
