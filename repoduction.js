import { chromium } from "playwright";
import fetch from "node-fetch";

(async () => {
  const browserOne = await chromium.launch({
    args: ["--remote-debugging-port=9222"],
    devTools: true,
    headless: false,
  });

  const contextOne = await browserOne.newContext({
    userAgent: "Some Overriden User Agent",
  });
  await contextOne.addCookies([
    {
      name: "Some cookie",
      value: "Some cookie value",
      url: "https://example.com",
    },
  ]);
  contextOne.addInitScript(() => (window.hello = "hello"));

  const pageOne = await contextOne.newPage();
  await pageOne.goto("https://google.com");

  // BEGIN: Try to connect to previously created Chromium session via CDP
  const [{ webSocketDebuggerUrl: debugWsUrl }] = await fetch(
    "http://localhost:9222/json/list"
  ).then((r) => r.json());

  const browserTwo = await chromium.connectOverCDP(debugWsUrl);

  // Shows 1 context
  console.log(
    "Number of contexts in CDP browser session: ",
    browserTwo.contexts().length
  );
  const contextTwo = browserTwo.contexts()[0];

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
})();
