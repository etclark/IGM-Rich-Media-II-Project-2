const models = require('../models');
const Product = models.Product;
const Account = models.Account;

const favoritesPage = (req, res) => {
  Product.ProductModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), products: docs });
  });
};

const getFavorites = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.session.account.username , (err, doc) => {
       if (err) {
         console.log(err);
         return res.status(400).json({ error: 'An error occured' });
       }
       return res.json({ products: doc.products });
     });
};

const productsPage = (request, response) => {
  const req = request;
  const res = response;

  Product.ProductModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), products: docs });
  });
};

const getProducts = (request, response) => {
  // const req = request
  const res = response;

  return Product.ProductModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ products: docs });
  });
};

//BROKEN
const getProductsByTag = (request, response) => {
  const req = request
  const res = response;
  const searchTerm = req.query.tag;
  console.log(searchTerm);

  return Product.ProductModel.find({tag: searchTerm}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ products: docs });
  });
};

const deleteProduct = (request, response) => {
  const req = request;
  const res = response;

  Product.ProductModel.findById(req.body._id, (err, result) => {
    const product = result._doc;
    Account.AccountModel.findOneAndUpdate(
      {username: req.session.account.username},
      {$pull: {products: {_id: product._id}}},
      (error) => {
        if(error){
            return res.status(400).json({ error: 'An error occured' });
        }
        return res.status(200).json({ complete: 'Deletion complete' });
      }
    );
  });
};

const saveProduct = (request, response) => {
  const req = request;
  const res = response;

  // Find product to be saved
  Product.ProductModel.findById(req.body._id, (err, result) => {
    const product = result;
    
    Account.AccountModel.findOneAndUpdate(
      {username: req.session.account.username},
      {$push: {products: product}},
      (err) => {
        if(err){
          return res.status(400).json({error: 'There was an error saving this favorite'});
        }
        return res.json({redirect: '/favorites'});
      }
    );
  });
};

// Exports
module.exports.favoritesPage = favoritesPage;
module.exports.getFavorites = getFavorites;
module.exports.productsPage = productsPage;
module.exports.getProducts = getProducts;
module.exports.getProductsByTag = getProductsByTag;
module.exports.delete = deleteProduct;
module.exports.save = saveProduct;
