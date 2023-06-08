import * as globalConfig from "./config";
import { By, Key, WebDriver, WebElement } from "selenium-webdriver";
import * as reporter from "./reporter";
import * as utils_common from "./utils_common";

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
  let ele = await driver.findElement(By.xpath(xpath));
  if ((await ele.isDisplayed()) == true) {
    await highlight_element(ele);
    await move_to_element(ele);
    await ele.sendKeys(Key.ENTER);
    await reporter.pass("Press entered on element [ " + xpath + " ]", true);
  } else {
    await reporter.warn("Element found with xpath, but not displayed [ " + xpath + " ]", true);
  }
}

export async function wait_for_element_to_be_present_on_ui(xpath: string, waitTimeInSeconds: number) {
  await driver.manage().setTimeouts({ implicit: 0 });
  for (let i = 0; i < waitTimeInSeconds; i++) {
    await utils_common.sleep(1);
    try {
      if ((await driver.findElements(By.xpath(xpath))).length > 0) {
        await reporter.debug("Element with xpath [ " + xpath + " ] found in " + i + " seconds");
        return true;
      }
    } catch (error) {
      await reporter.debug("Got error for findElements, retrying..." + error);
    }
  }
  return false;
}

export async function verify_read_only_text(value: string, strict_check = true) {
  let ele: WebElement;
  try {
    let XPATH = "";
    if (strict_check == false) {
      let case_in_sensitive_xpath = 'translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="' + value.toLowerCase() + '"';
      XPATH = '//*[normalize-space(text())="' + value + '" or normalize-space(@title)="' + value + '" or .="' + value + '" or ' + case_in_sensitive_xpath + "]";
    } else {
      XPATH = '//*[normalize-space(text())="' + value + '" or normalize-space(@title)="' + value + '" or .="' + value + '"]';
    }
    await reporter.debug(XPATH);
    ele = await driver.findElement(By.xpath(XPATH));
    if ((await ele.isDisplayed()) == true) {
      await highlight_element(ele);
      await move_to_element(ele);
      await reporter.pass("Text found [ " + value + " ]", true);
    } else {
      await reporter.warn("Text found but not displayed [ " + value + " ]", true);
    }
  } catch (error) {
    await reporter.fail_and_continue("Text not found [ " + value + " ]", true);
  }
}

async function highlight_element(ele: WebElement) {
  await driver.executeScript("arguments[0].style.border = '1px solid green';", ele);
}

async function move_to_element(ele: WebElement) {
  await driver.executeScript("arguments[0].scrollIntoView({behavior: 'auto',block: 'center',inline: 'center'});", ele);
}
