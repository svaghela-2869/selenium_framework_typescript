import * as globalConfig from "./config";
import { WebDriver } from "selenium-webdriver";

let driver: WebDriver;

export async function launch_url(url: string) {
   globalConfig.setDriver();
   driver = globalConfig.driver;
   await driver.get(url);
}

export async function quit() {
   globalConfig.quitDriver();
}
