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
    return res.status(400).json({ error: 'RAWR! All fields are required' });
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
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
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

// UNFINISHED!!!
const changePassword = (request, response) => {
  const req = request;
  const res = response;

     // cast to strings to cover up some security flaws
  req.body.currentPass = `${req.body.currentPass}`;
  req.body.newPass = `${req.body.newPass}`;

  if (!req.body.currentPass || !req.body.newPass) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (req.body.currentPass !== req.body.newPass) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  // CANT CALL VALIDATE PASSWORD BECAUSE NOT PUBLIC MEMBER OF
  // ACCOUNTMODEL IN ACCOUNT.JS, SHOULD I MAKE NEW VALIDATION FUCNTION?
  return Account.AccountModel.validatePassword(
    req.session.account, req.body.currentPass, (result) => {
      if (result) { // Password belongs to the account
      // Create new password
        return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
          const accountData = {
            username: req.body.username,
            salt,
            password: hash,
          };
        // THIS CODE ADDS NEW THINGS, I JUST WANT TO UPDATE WHAT ALREADY EXISTS
          const newAccount = new Account.AccountModel(accountData);
          const savePromise = req.session.account.save();

          req.session.account = Account.AccountModel.toAPI(newAccount);
          savePromise.then(() => res.json({ redirect: '/favorites' }));
          savePromise.catch((err) => {
            console.log(err);
            if (err.code === 11000) {
              return res.status(400).json({ error: 'Password is the same as before' });
            }
            return res.status(400).json({ error: 'An error occurred' });
          });
        });
      }     // Password is not the same as the account's
      return res.status(400).json({ error: 'The original password is incorrect' });
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
