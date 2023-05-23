import { WebDriver, Builder } from "selenium-webdriver";

export let driver: WebDriver;
export let spec: any = {};

export function set_driver(browser: string) {
   if (browser == "chrome" || browser == "firefox" || browser == "safari") {
      driver = new Builder().forBrowser(browser).build();
      driver.manage().window().maximize();
   } else {
      throw new Error("Please select any of the supported browser ( chrome, firefox, safari ).");
   }
}
