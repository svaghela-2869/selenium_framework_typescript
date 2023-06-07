const yargs = require("yargs").argv;

import * as reporter from "../../lib/commom/reporter";
import * as utils_common from "../../lib/commom/utils_common";
import * as uihelper from "../../lib/commom/uihelper";
import * as globalConfig from "../../lib/commom/config";
import { Random } from "random-test-values";

import { By } from "selenium-webdriver";

describe(__filename.split("selenium_framework_typescript/")[1], async function () {
  //setting up basic details for running the spec
  before(function () {
    utils_common.init(yargs, __dirname, __filename);
  });

  beforeEach(function () {
    reporter.clear_context();
  });

  for (let i = 0; i < 10; i++) {
    it("CODEZEROES - DUMP", async function () {
      await reporter.info(new Date().toLocaleString());
      await uihelper.launch_url("https://www.codezeros.com/contact");

      let dumpName = Random.String({ minLength: 3, maxLength: 9 });
      let dumpNumber = Random.Number({ max: 99999, min: 100 }).toString();
      let choiceAvailable = ["New Business", "Careers", "Other inquiries"];
      let randomChoice = Random.Number({ max: 2, min: 0 }).toString();
      let randomMobile = Random.Number({
        max: 9999999999,
        min: 1000000000,
      }).toString();
      let dumpDescription = Random.String({ minLength: 1, maxLength: 300 });

      await globalConfig.driver.findElement(By.xpath("//select[@id='contact-choice']")).sendKeys(choiceAvailable[randomChoice]);
      await globalConfig.driver.findElement(By.xpath("//input[@id='contact-name']")).sendKeys(dumpName);
      await globalConfig.driver.findElement(By.xpath("//input[@id='contact-email']")).sendKeys(dumpName + "." + dumpNumber + "@codezeroes.dump.com");
      await globalConfig.driver.findElement(By.xpath("//input[@id='contact-phone']")).sendKeys(randomMobile);
      await globalConfig.driver.findElement(By.xpath("//textarea[@id='contact-message']")).sendKeys(dumpDescription);

      await reporter.pass("Data entered in fields.", true);
      await globalConfig.driver.findElement(By.xpath("//input[@type='submit']")).click();
      await uihelper.waitForElementToBePresentOnUI("//input[@value='Sent']", 10);
      await reporter.pass("Submit clicked.", true);
    });
  }

  afterEach(async function () {
    await reporter.add_to_context(this);
  });

  after(async function () {
    globalConfig.quit_driver();
  });
});
