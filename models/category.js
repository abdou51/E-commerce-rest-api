const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: { 
        type: String,
    }
});

categorySchema.pre('save', async function(next) {
    if (this.isNew) {
        const highestCategoryId = await mongoose.model('Category', categorySchema).findOne({}, '_id').sort('-_id').exec();
        this._id = highestCategoryId ? highestCategoryId._id + 1 : 1;
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

exports.Category = Category;
