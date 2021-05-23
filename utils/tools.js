module.exports = {
  delay: (t) => new Promise((r) => setTimeout(r, t)),
  random: (min, max) => Math.floor(Math.random() * (max - min) + min),
};
