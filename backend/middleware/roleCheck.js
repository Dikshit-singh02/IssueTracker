const roleCheck = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: `Access denied. Requires one of: ${roles.join(', ')}` });
    }
    next();
  };
};

module.exports = roleCheck;
