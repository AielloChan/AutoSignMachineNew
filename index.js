(async () => {
  try {
    require("./AutoSignMachine.js").run();
  } catch (e) {
    if (process.env.DEBUG_MODE) {
      console.log(e);
    }
  }
})();
