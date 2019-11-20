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

  return Account.AccountModel.find({ username: req.session.account.username },
     'products', (err, docs) => {
       if (err) {
         console.log(err);
         return res.status(400).json({ error: 'An error occured' });
       }
    // DOCS.PRODUCTS IS UNDEFINED? BUT IT SAYS IT IS AN EMPTY ARRAY?
       console.log(docs);
       console.log(docs.products);
       return res.json({ products: docs.products });
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

const deleteProduct = (request, response) => {
  const req = request;
  const res = response;

  return Product.ProductModel.deleteOne({ _id: req.body._id }, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.status(200).json({ complete: 'Deletion complete' });
  });
};

const saveProduct = (request, response) => {
  // UNFINISHED!!!
  const req = request;
  const res = response;

  // Find product to be saved
  console.log(req.body);
  Product.ProductModel.find({ _id: req.body._id }, (result) => {
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

    // // Find account to save it to
    // Account.AccountSchema.statics.findByUsername(req.session.account.username, (err, account) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   // Add product to account array
    //   account.products.push(product);
    //   console.log(account.products);

    //   // Save product to account array
    //   const savePromise = account.save();
    //   savePromise.then(() => res.json({ redirect: '/favorites' }));
    //   savePromise.catch((error) => {
    //     console.log(error);
    //     if (error.code === 11000) {
    //       return res.status(400).json({ error: 'You already have this favorite!' });
    //     }
    //     return res.status(400).json({ error: 'An error occurred' });
    //   });
    // });
  });
};

// Exports
module.exports.favoritesPage = favoritesPage;
module.exports.getFavorites = getFavorites;
module.exports.productsPage = productsPage;
module.exports.getProducts = getProducts;
module.exports.delete = deleteProduct;
module.exports.save = saveProduct;
