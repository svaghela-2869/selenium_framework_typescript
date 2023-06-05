import { WebDriver, Builder } from "selenium-webdriver";

export let driver: WebDriver;
export let spec: any = {};

export function set_driver(browser: string, docker: string) {
  if (browser.toLowerCase() == "chrome") {
    if (docker == "true") {
      driver = new Builder().usingServer("http://localhost:4444/").forBrowser("chrome").build();
    } else {
      driver = new Builder().forBrowser("chrome").build();
    }
  } else if (browser.toLowerCase() == "firefox") {
    if (docker == "true") {
      driver = new Builder().usingServer("http://localhost:4444/").forBrowser("firefox").build();
    } else {
      driver = new Builder().forBrowser("firefox").build();
    }
  } else if (browser.toLowerCase() == "edge") {
    if (docker == "true") {
      driver = new Builder().usingServer("http://localhost:4444/").forBrowser("MicrosoftEdge").build();
    } else {
      driver = new Builder().forBrowser("MicrosoftEdge").build();
    }
  } else if (browser.toLowerCase() == "safari") {
    driver = new Builder().forBrowser("safari").build();
  }
  driver.manage().window().maximize();
}

export function close_driver() {
  const waitTill = new Date(new Date().getTime() + 2000);
  while (waitTill > new Date()) {}
  driver.close();
}

export function quit_driver() {
  const waitTill = new Date(new Date().getTime() + 5000);
  while (waitTill > new Date()) {}
  driver.quit();
}
