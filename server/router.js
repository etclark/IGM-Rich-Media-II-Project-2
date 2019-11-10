const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getFavorites', mid.requiresSecure, controllers.Product.getFavorites);
  // app.get('/getProducts', mid.requiresSecure, controllers.Product.getProducts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/browse', mid.requiresLogin, controllers.Product.browsePage);
  // app.post('/favorites', mid.requiresLogin, controllers.Product.make);
  app.get('/favorites', mid.requiresLogin, controllers.Product.favoritesPage);
  // app.post('/favorites', mid.requiresLogin, controllers.Product.make);
  app.post('/deleter', mid.requiresLogin, controllers.Product.delete);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
