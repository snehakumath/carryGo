const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res) => {
  console.log("Check auth");
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ authenticated: true });
  } catch (err) {
    return res.json({ authenticated: false });
  }
};
