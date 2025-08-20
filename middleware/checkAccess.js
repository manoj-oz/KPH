// middleware/checkAccess.js

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next(); // user is logged in
  } else {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }
}

function hasAccess(requiredAccess) {
  return function (req, res, next) {
    const user = req.session?.user;
    const accessKey = `access_${requiredAccess}`;

    if (user && user[accessKey]) {
      next(); // user has the required access
    } else {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }
  };
}

module.exports = {
  isAuthenticated,
  hasAccess
};
