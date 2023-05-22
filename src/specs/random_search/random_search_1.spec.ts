import * as uihelper from "../../../lib/commom/uihelper";
// import { Random } from "random-test-values";

describe(__filename.split("src/")[1], function () {
   it("Random Text Search.", async function () {
      await uihelper.launch_url("https://google.com");
      // await driver.wait(until.elementLocated(By.xpath("//*[@name='q']")), 10000);
      // let searchBox = await driver.findElement(By.xpath("//*[@name='q']"));
      // let randomText = Random.String();
      // await searchBox.sendKeys(randomText);
      // await searchBox.sendKeys(Key.ENTER);
   });
   after("Quit Driver", async function () {
      uihelper.quit();
   });
});
