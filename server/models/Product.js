const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
let ProductModel = {};
// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  imageLink: {
    type: String,
    min: 0,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  saved: {
    type: Boolean,
    required: true,
  },
  referLink: {
    type: String,
    min: 0,
    required: true,
  },
  tag: {
    type: String,
    min: 0,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  savedDate: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  imageLink: doc.imageLink,
  price: doc.price,
  saved: doc.saved,
  referLink: doc.referLink,
});

ProductSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return ProductModel.find(search).select('name imageLink price saved referLink').exec(callback);
};

ProductModel = mongoose.model('Product', ProductSchema);

module.exports.ProductModel = ProductModel;
module.exports.ProductSchema = ProductSchema;
