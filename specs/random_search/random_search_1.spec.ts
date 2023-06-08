const yargs = require("yargs").argv;

import * as reporter from "../../lib/commom/reporter";
import * as utils_common from "../../lib/commom/utils_common";
import * as uihelper from "../../lib/commom/uihelper";
import * as globalConfig from "../../lib/commom/config";
import { Random } from "random-test-values";

describe(__filename.split("selenium_framework_typescript/")[1], function () {
  before(function () {
    utils_common.init(yargs, __dirname, __filename);
  });

  beforeEach(function () {
    reporter.clear_context();
  });

  for (let i = 0; i < 1; i++) {
    it("Random Text Search.", async function () {
      await uihelper.launch_url("https://google.com");
      let randomText = Random.String();
      await uihelper.set_text_with_xpath("//*[@name='q']", randomText);
      await uihelper.press_enter("//*[@name='q']");
    });
  }

  afterEach(async function () {
    reporter.add_to_context(this);
  });

  after(async function () {
    globalConfig.quit_driver();
  });
});
