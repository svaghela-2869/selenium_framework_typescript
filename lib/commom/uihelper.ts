import * as globalConfig from "./config";
import { By, Key, WebDriver, WebElement } from "selenium-webdriver";
import * as reporter from "./reporter";
import * as utils_common from "./utils_common";

let driver: WebDriver;

export async function launch_url(url: string) {
  await reporter.entry_log("launch_url");

  driver = globalConfig.driver;
  await driver.get(url);
  await reporter.pass("URL [ " + url + " ] launched", true);

  await reporter.exit_log("launch_url");
}

export async function set_text_with_xpath(xpath: string, value: string) {
  await reporter.entry_log("set_text_with_xpath");

  await reporter.debug(xpath);
  await driver.findElement(By.xpath(xpath)).sendKeys(value);
  await reporter.pass("Value [ " + value + " ] enterd in element [ " + xpath + " ]", true);

  await reporter.exit_log("set_text_with_xpath");
}

export async function press_enter(xpath: string) {
  await reporter.entry_log("press_enter");

  await reporter.debug(xpath);
  let ele = await driver.findElement(By.xpath(xpath));
  if ((await ele.isDisplayed()) == true) {
    await highlight_element(ele);
    await move_to_element(ele);
    await ele.sendKeys(Key.ENTER);
    await reporter.pass("Press entered on element [ " + xpath + " ]", true);
  } else {
    await reporter.warn("Element found with xpath, but not displayed [ " + xpath + " ]", true);
  }

  await reporter.exit_log("press_enter");
}

export async function wait_for_element_to_be_present_on_ui(xpath: string, wait_time_in_seconds: number) {
  await reporter.entry_log("wait_for_element_to_be_present_on_ui");

  await reporter.debug(xpath);
  await driver.manage().setTimeouts({ implicit: 0 });
  for (let i = 0; i < wait_time_in_seconds; i++) {
    await sleep("1");
    try {
      if ((await driver.findElements(By.xpath(xpath))).length > 0) {
        await reporter.pass("Element with xpath [ " + xpath + " ] found in " + i + " seconds");
        return true;
      }
    } catch (error) {
      await reporter.debug("Got error for findElements, retrying..." + error);
    }
  }

  await reporter.exit_log("wait_for_element_to_be_present_on_ui");
  return false;
}

export async function verify_read_only_text(value: string, strict_check = true) {
  await reporter.entry_log("verify_read_only_text");

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
    if (ele) {
      if ((await ele.isDisplayed()) == true) {
        await highlight_element(ele);
        await move_to_element(ele);
        await reporter.pass("Text found [ " + value + " ]", true);
      } else {
        await reporter.warn("Text found but not displayed [ " + value + " ]", true);
      }
    } else {
      await reporter.fail_and_continue("Text not found [ " + value + " ]", true);
    }
  } catch (error) {
    await reporter.fail(String(error), true);
  }

  await reporter.exit_log("verify_read_only_text");
}

async function highlight_element(ele: WebElement) {
  await reporter.entry_log("highlight_element");
  await driver.executeScript("arguments[0].style.border = '1px solid green';", ele);
  await reporter.exit_log("highlight_element");
}

async function move_to_element(ele: WebElement) {
  await reporter.entry_log("move_to_element");
  await driver.executeScript("arguments[0].scrollIntoView({behavior: 'auto',block: 'center',inline: 'center'});", ele);
  await reporter.exit_log("move_to_element");
}

export async function click_with_xpath(xpath: string) {
  await reporter.entry_log("click_with_xpath");

  await reporter.debug(xpath);
  let ele = await driver.findElement(By.xpath(xpath));
  if ((await ele.isDisplayed()) == true) {
    await highlight_element(ele);
    await move_to_element(ele);
    await ele.click();
    await reporter.pass("Clicked on element [ " + xpath + " ]", true);
  } else {
    await reporter.warn("Element found with xpath, but not displayed [ " + xpath + " ]", true);
  }

  await reporter.exit_log("click_with_xpath");
}

export async function sleep(seconds: string) {
  await reporter.entry_log("sleep");

  await utils_common.sleep(Number(seconds));
  await reporter.debug(seconds + " second sleep done, time to wake up.");

  await reporter.exit_log("sleep");
}

export async function wait_for_page_to_load(wait_time_in_seconds: string) {
  reporter.entry_log("wait_for_page_to_load");

  await driver.manage().setTimeouts({ implicit: 0 });
  for (let i = 0; i < Number(wait_time_in_seconds); i++) {
    await sleep("1");
    try {
      if (String(await driver.executeScript("return document.readyState")) == "complete") {
        await reporter.pass("Page loaded sucessfully.", true);
        return;
      }
    } catch (error) {
      await reporter.debug("Got error for findElements, retrying..." + error);
    }
  }

  reporter.exit_log("wait_for_page_to_load");
}
