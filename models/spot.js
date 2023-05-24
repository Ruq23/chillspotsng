const mongoose = require ('mongoose');
const { spotSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true }};

const SpotSchema = new Schema ({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    geometry: {
        type: {
            "type": String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    image: [
        {
            url: String,
            filename: String
        }
    ],
 
}, opts);


SpotSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a href="/list/${this._id}">${this.name}</a>
    <p>${this.about .substring(0, 20)}.....</p>`
})




SpotSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Spot', SpotSchema);
