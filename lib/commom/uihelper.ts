import * as globalConfig from "./config";
import { By, Key, WebDriver } from "selenium-webdriver";
import * as reporter from "./reporter";

let driver: WebDriver;

export async function launch_url(url: string) {
   driver = globalConfig.driver;
   await driver.get(url);
   await reporter.pass("URL [ " + url + " ] launched", true);
}

export async function set_text_with_xpath(xpath: string, value: string) {
   await driver.findElement(By.xpath(xpath)).sendKeys(value);
   await reporter.pass("Value [ " + value + " ] enterd in element [ " + xpath + " ]", true);
}

export async function press_enter(xpath: string) {
   await driver.findElement(By.xpath(xpath)).sendKeys(Key.ENTER);
   await reporter.pass("Press entered on element [ " + xpath + " ]", true);
}
