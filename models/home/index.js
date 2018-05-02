'use strict';
import mongoose from 'mongoose';

const {Schema} = mongoose;
const homeSchema = new Schema({
    bannerList: [String],
    articleList: [
        {}
    ]
})