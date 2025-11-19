exports.sessionUser = (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      userId: req.session.user.id,
      name: req.session.user.name,
      email: req.session.user.email,
    });
  }

  res.json({ loggedIn: false });
};
