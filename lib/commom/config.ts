import { WebDriver, Builder } from "selenium-webdriver";

export let driver: WebDriver;

export function setDriver() {
   driver = new Builder().forBrowser("chrome").build();
   driver.manage().window().maximize();
}

export function quitDriver() {
   const waitTill = new Date(new Date().getTime() + 5000);
   while (waitTill > new Date()) {}
   driver.quit();
}
