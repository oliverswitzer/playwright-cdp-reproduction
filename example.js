const { chromium } = require("playwright-chromium");

(async () => {
  const browserTwo = await chromium.connectOverCDP(process.argv[2]);
  const contextTwo = browserTwo.contexts()[0];

  console.log(browserTwo.contexts().length);
  console.log(browserTwo.pages().length);

  const pageTwo = await contextTwo.newPage();

  // Creating a new page returns error:
  //
  //
})();
