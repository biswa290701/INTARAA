module.exports = (req, res, next) => {
  if (req.url.endsWith(".unityweb")) {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Encoding", "identity");
  }
  if (req.url.endsWith(".wasm")) {
    res.setHeader("Content-Type", "application/wasm");
    res.setHeader("Content-Encoding", "identity");
  }
  next();
};
