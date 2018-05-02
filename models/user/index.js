'use strict';
import mongoose from 'mongoose';

const {Schema} = mongoose;
const userSchema = new Schema({
    user_name: String,
    id: Number,
    create_time: {type: Date, default: Date.now()},
    role: Number,
    city: String,
    phoneNumber: String,
    account: String,
    password: String,
    sex: Number,
    age: Number,
    head_img: String,
})

const userModal = mongoose.model('user', userSchema);


export default userModal;