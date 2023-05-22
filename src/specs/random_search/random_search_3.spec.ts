import { Builder, By, until, Key } from "selenium-webdriver";
import { Random } from "random-test-values";

let driver = new Builder().forBrowser("chrome").build();
driver.manage().window().maximize();

describe(__filename, function () {
   it("Random Text Search.", async function () {
      await driver.get("https://google.com");
      await driver.wait(until.elementLocated(By.xpath("//*[@name='q']")), 10000);
      let searchBox = await driver.findElement(By.xpath("//*[@name='q']"));
      let randomText = Random.String();
      await searchBox.sendKeys(randomText);
      await searchBox.sendKeys(Key.ENTER);
   });
   after("Quit Driver", async function () {
      const waitTill = new Date(new Date().getTime() + 5000);
      while (waitTill > new Date()) {}
      await driver.close();
   });
});
