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
    reporter.warn("Element found with xpath, but not displayed [ " + xpath + " ]", true);
  }
}

export async function waitForElementToBePresentOnUI(xpath: string, waitTimeInSeconds: number) {
  await driver.manage().setTimeouts({ implicit: 0 });
  for (let i = 0; i < waitTimeInSeconds; i++) {
    await utils_common.sleep(1);
    try {
      if ((await driver.findElements(By.xpath(xpath))).length > 0) {
        reporter.debug("Element with xpath [ " + xpath + " ] found in " + i + " seconds");
        return true;
      }
    } catch (error) {
      reporter.debug("Got error for findElements, retrying..." + error);
    }
  }
  return false;
}

export async function verify_read_only_text(value: string) {
  let ele: WebElement;
  try {
    reporter.debug("//*[.='" + value + "']");
    ele = await driver.findElement(By.xpath("//*[.='" + value + "']"));
    if ((await ele.isDisplayed()) == true) {
      await highlight_element(ele);
      await move_to_element(ele);
      reporter.pass("Text found [ " + value + " ]", true);
    } else {
      reporter.warn("Text found but not displayed [ " + value + " ]", true);
    }
  } catch (error) {
    reporter.fail_and_continue("Text not found [ " + value + " ]", true);
  }
}

async function highlight_element(ele: WebElement) {
  await driver.executeScript("arguments[0].style.border = '5px solid green';", ele);
}

async function move_to_element(ele: WebElement) {
  await driver.executeScript("arguments[0].scrollIntoView({behavior: 'auto',block: 'center',inline: 'center'});", ele);
}
