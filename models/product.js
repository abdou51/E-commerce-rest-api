const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    descriptions: [
      {
        language: {
          type: String,
          enum: ["ar", "fr", "eng"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    volume: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
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
  },
  { timestamps: true, versionKey: false }
);

productSchema.virtual("ObjectId").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.Product = mongoose.model("Product", productSchema);
