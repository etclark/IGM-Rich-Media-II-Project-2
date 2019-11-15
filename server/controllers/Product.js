const models = require('../models');
const Product = models.Product;

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

  return Product.ProductModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ products: docs });
  });
};

// const makeProduct = (req, res) => {
//   if (!req.body.name || !req.body.age) {
//     return res.status(400).json({ error: 'RAWR! Both name and age are required' });
//   }
//   const productData = {
//     name: req.body.name,
//     age: req.body.age,
//     price: req.body.price,
//     owner: req.session.account._id,
//   };
//   const newProduct = new Product.ProductModel(productData);
//   const productPromise = newProduct.save();

//   productPromise.then(() => res.json({ redirect: '/favorites' }));
//   productPromise.catch((err) => {
//     console.log(err);
//     if (err.code === 11000) {
//       return res.status(400).json({ error: 'Product already exists' });
//     }
//     return res.status(400).json({ error: 'An error occurred' });
//   });
//   return productPromise;
// };

const productsPage = (request, response) => {
  const req = request;
  const res = response;

  // WHAT SHOULD THIS LINE BE?!
  // return res.render('app', { csrfToken: req.csrfToken(), products: Product.ProductModel });
  Product.ProductModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), products: docs });
  });
};

const getProducts = (request, response) => {
  //const req = request;
  const res = response;

  // NOW WHAT SHOULD WE DO HERE?
  console.log("Getting Products");
  return Product.ProductModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    console.log("Got Products");
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
  //UNFINISGHED!!!
  //Save Product Id into array and search
  //array should be a part of each account
  //Array contains IDs of products that could then be searched through
  //saveProduct should say IDs to this array
  const req = request;
  const res = response;

  const productData = {
        name: req.body.name,
        imageLink: req.body.imageLink,
        price: req.body.price,
        saved: true,
        referLink: req.body.referLink,
        owner: req.session.account._id,
      };

  const newProduct = new Product.ProductModel(productData);
    const productPromise = newProduct.save();
      
    productPromise.then(() => res.json({ redirect: '/favorites' }));
    productPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Product already exists' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
    return productPromise;
};

// Exports
module.exports.favoritesPage = favoritesPage;
module.exports.getFavorites = getFavorites;
module.exports.productsPage = productsPage;
module.exports.getProducts = getProducts;
// module.exports.make = makeProduct;
module.exports.delete = deleteProduct;
module.exports.save = saveProduct;
