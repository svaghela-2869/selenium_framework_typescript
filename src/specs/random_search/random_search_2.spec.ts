// import { spec_runner } from "lib/commom/generic_spec_runner.spec";
const yargs = require("yargs").argv;
// spec_runner(yargs, __dirname, __filename);

import * as reporter from "../../../lib/commom/reporter";
import * as utils_common from "../../../lib/commom/utils_common";
import * as uihelper from "../../../lib/commom/uihelper";
import { Random } from "random-test-values";

describe(__filename.split("selenium_framework_typescript/")[1], function () {
   //setting up basic details for running the spec
   before(function () {
      utils_common.init(yargs, __dirname, __filename);
   });

   beforeEach(function () {
      reporter.clearContext();
   });

   for (let i = 0; i < 2; i++) {
      it("Random Text Search.", async function () {
         await uihelper.launch_url("https://google.com");
         let randomText = Random.String();
         await uihelper.set_text_with_xpath("//*[@name='q']", randomText);
         await uihelper.press_enter("//*[@name='q']");
      });
   }

   afterEach(async function () {
      reporter.addToContext(this);
   });

   after(async function () {
      utils_common.quit_driver();
   });
});
