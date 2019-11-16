const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required to proceed' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/favorites' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

     // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required to proceed' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      products: [],
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    req.session.account = Account.AccountModel.toAPI(newAccount);
    savePromise.then(() => res.json({ redirect: '/favorites' }));
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

//Allows user to change password
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.currentPass = `${req.body.currentPass}`;
  req.body.newPass = `${req.body.newPass}`;

  if (!req.body.currentPass || !req.body.newPass) {
    return res.status(400).json({ error: 'All fields are required to proceed' });
  }

  return Account.AccountModel.authenticate(req.session.account.username, req.body.currentPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    
    console.log(account);
    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      account.salt = salt;
      account.password = hash;

      const savePromise = account.save();
      console.log(account);
          savePromise.then(() => res.json({ redirect: '/favorites' }));
          savePromise.catch((err) => {
            console.log(err);
            if (err.code === 11000) {
              return res.status(400).json({ error: 'Password is the same as before' });
            }
            return res.status(400).json({ error: 'An error occurred' });
          });
  });
});
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

// Exports
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
