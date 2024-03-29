//@ts-check
import { chromium } from "playwright";

(async () => {
  const context1 = await chromium.launchPersistentContext("", {
    args: ["--remote-debugging-port=9222"],
    headless: false,
    userAgent: "Some Overriden User Agent",
  });

  await context1.addCookies([
    {
      name: "Some cookie",
      value: "Some cookie value",
      url: "https://example.com",
    },
  ]);
  context1.addInitScript(() => (window.hello = "hello"));

  const pageOne = await context1.newPage();
  await pageOne.goto("https://google.com");

  const browser2 = await chromium.connectOverCDP("http://localhost:9222");

  // Shows 1 context
  console.log(
    "Number of contexts in CDP browser session: ",
    browser2.contexts().length
  );
  const contextTwo = browser2.contexts()[0];

  // Shows 0 pages
  console.log(
    "Number of pages in CDP browser session: ",
    contextTwo.pages().length
  );

  // Creating a new page blows up with error:
  //
  // browserContext.newPage: Cannot read property 'pageOrError' of undefined
  //    at file:///Users/oliverswitzer/workspace/playwright-cdp-spike/first_session.js:50:36 { name: 'TypeError' }
  const pageTwo = await contextTwo.newPage();
  const hello = await pageTwo.evaluate(() => window.hello);
  console.log("say: ", hello);
  await browser2.close();
  await context1.close();
})();
