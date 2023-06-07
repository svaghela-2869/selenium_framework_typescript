import { configure, getLogger } from "log4js";
const addContext = require("mochawesome/addContext");
// const screenshot = require("desktop-screenshot");
import * as utils_common from "./utils_common";
import * as globalConfig from "./config";
import { writeFileSync } from "fs";
import { assert } from "chai";

const logger = getLogger();
export let contextMessages: any[] = [];
export let step_status = { abort: false, fail: false, msg: "" };

export function set_logger() {
  configure({
    appenders: {
      out: {
        type: "stdout",
        layout: { type: "pattern", pattern: "[%d{yyyy-MM-dd} %r] [%p] %m" },
      },
    },
    categories: { default: { appenders: ["out"], level: "debug" } },
  });
}

export function clear_context() {
  contextMessages = [];
  step_status.fail = false;
}

export async function debug(value: string) {
  logger.debug(value);
  return;
}

export async function info(msg: string, screenShot?: boolean) {
  logger.info(msg);
  let contMsg: any = {};

  contMsg.txt = "[INFO] : " + msg;

  if (screenShot) {
    let imagePath = "/screenshots/" + utils_common.get_time_stamp() + ".png";
    await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
    contMsg.img = "." + imagePath;
  }

  contextMessages.push(contMsg);
  return;
}

export async function pass(msg: string, screenShot?: boolean) {
  logger.info(msg);
  let contMsg: any = {};

  contMsg.txt = "[PASS] : " + msg;

  if (screenShot) {
    let imagePath = "/screenshots/" + utils_common.get_time_stamp() + ".png";
    await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
    contMsg.img = "." + imagePath;
  }

  contextMessages.push(contMsg);

  return;
}

export async function warn(msg: string, screenShot?: boolean) {
  logger.warn(msg);
  let contMsg: any = {};

  contMsg.txt = "[WARN] : " + msg;

  if (screenShot) {
    let imagePath = "/screenshots/" + utils_common.get_time_stamp() + ".png";
    await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
    contMsg.img = "." + imagePath;
  }

  contextMessages.push(contMsg);

  return;
}

export async function fail_and_continue(msg: string, screenShot?: boolean) {
  logger.error(msg);
  let contMsg: any = {};

  contMsg.txt = "[ERROR] : " + msg;
  if (screenShot) {
    let imagePath = "/screenshots/" + utils_common.get_time_stamp() + ".png";
    await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
    contMsg.img = "." + imagePath;
  }

  contextMessages.push(contMsg);

  step_status.fail = true;
  step_status.msg = msg;
}

export async function fail(msg: string, screenShot?: boolean) {
  logger.fatal(msg);
  let contMsg: any = {};

  contMsg.txt = "[FAIL] : " + msg;
  if (screenShot) {
    let imagePath = "/screenshots/" + utils_common.get_time_stamp() + ".png";
    await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
    contMsg.img = "." + imagePath;
  }

  contextMessages.push(contMsg);

  step_status.abort = true;
  step_status.fail = true;
  step_status.msg = msg;

  assert.fail(msg);
}

export async function add_to_context(testContext: Mocha.Context) {
  contextMessages.forEach((msg) => {
    addContext(testContext, msg.txt);
    if (msg.img) {
      addContext(testContext, msg.img);
    }
  });
}

// export async function takeScreenshot(imagePath: string) {
//    return new Promise<void>((resolve, reject) => {
//       screenshot(imagePath, function (error: any) {
//          if (error) {
//             // throw new Error("Failed to capture screenshot : " + error);
//             logger.error(error);
//             reject();
//          } else {
//             resolve();
//          }
//       });
//    });
// }

export async function takeScreenshot(imagePath: string) {
  try {
    let image = await globalConfig.driver.takeScreenshot();
    writeFileSync(imagePath, image, "base64");
  } catch (error) {
    logger.error(error);
  }
}
