import { WebDriver, Builder } from "selenium-webdriver";

export let driver: WebDriver;
export let spec: any = {};

export function set_driver(browser: string, parallelRun: string) {
   if (parallelRun == "true") {
      if (browser == "chrome" || browser == "firefox") {
         driver = new Builder().forBrowser(browser).build();
         driver.manage().window().maximize();
      } else {
         throw new Error("Please select any of the supported browser ( chrome, firefox ).");
      }
   } else {
      if (browser == "chrome" || browser == "firefox" || browser == "safari") {
         driver = new Builder().forBrowser(browser).build();
         driver.manage().window().maximize();
      } else {
         throw new Error("Please select any of the supported browser ( chrome, firefox, safari ).");
      }
   }
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
