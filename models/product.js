const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    price : {
        type: Number,
        default:0
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    // richDescription: {
    //     type: String,
    //     default: ''
    // },
    // image: {
    //     type: String,
    //     default: ''
    // },
    
    // brand: {
    //     type: String,
    //     default: ''
    // },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category',
    //     required:true
    // },
    // countInStock: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    //     max: 255
    // },
    
})

productSchema.virtual('ObjectId').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


exports.Product = mongoose.model('Product', productSchema);
