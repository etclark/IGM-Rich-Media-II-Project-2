const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/favorites', mid.requiresLogin, controllers.Product.favoritesPage);
  app.get('/getFavorites', mid.requiresSecure, controllers.Product.getFavorites);
  app.get('/products', mid.requiresLogin, controllers.Product.productsPage);
  app.get('/getProducts', mid.requiresSecure, controllers.Product.getProducts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin,
  controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/deleter', mid.requiresLogin, controllers.Product.delete);
  app.post('/saver', mid.requiresLogin, controllers.Product.save);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
