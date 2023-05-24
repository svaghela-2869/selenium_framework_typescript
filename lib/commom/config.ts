import { WebDriver, Builder } from "selenium-webdriver";

export let driver: WebDriver;
export let spec: any = {};

export function set_driver(browser: string, parallelRun: string) {
   if (parallelRun == "true") {
      let supportedBrowsers = ["chrome", "firefox"];
      if (supportedBrowsers.includes(browser)) {
         driver = new Builder().forBrowser(browser).build();
         driver.manage().window().maximize();
      } else {
         throw new Error("Please select any of the supported browser : " + supportedBrowsers.toString());
      }
   } else {
      let supportedBrowsers = ["chrome", "firefox", "safari"];
      if (supportedBrowsers.includes(browser)) {
         driver = new Builder().forBrowser(browser).build();
         driver.manage().window().maximize();
      } else {
         throw new Error("Please select any of the supported browser : " + supportedBrowsers.toString());
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
