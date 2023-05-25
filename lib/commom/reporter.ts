import { configure, getLogger } from "log4js";
const addContext = require("mochawesome/addContext");
// const screenshot = require("desktop-screenshot");
import * as utils_common from "./utils_common";
import * as globalConfig from "./config";
import { writeFileSync } from "fs";
import { assert } from "chai";

const logger = getLogger();
export let contextMessages: any[] = [];

export function setLogger() {
   configure({
      appenders: { out: { type: "stdout", layout: { type: "pattern", pattern: "[%d{yyyy-MM-dd} %r] [%p] %m" } } },
      categories: { default: { appenders: ["out"], level: "debug" } },
   });
}

export function clearContext() {
   contextMessages = [];
}

export async function info(value: string, screenShot?: boolean) {
   logger.info(value);
   let contMsg: any = {};

   contMsg.txt = "[INFO] : " + value;

   if (screenShot) {
      let imagePath = "/screenshots/" + utils_common.getTimeStamp() + ".png";
      await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
      contMsg.img = "." + imagePath;
   }

   contextMessages.push(contMsg);
   return;
}

export async function pass(value: string, screenShot?: boolean) {
   logger.info(value);
   let contMsg: any = {};

   contMsg.txt = "[PASS] : " + value;

   if (screenShot) {
      let imagePath = "/screenshots/" + utils_common.getTimeStamp() + ".png";
      await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
      contMsg.img = "." + imagePath;
   }

   contextMessages.push(contMsg);

   return;
}

export async function fail(value: string, screenShot?: boolean) {
   logger.fatal(value);
   let contMsg: any = {};

   contMsg.txt = "[FAIL] : " + value;
   if (screenShot) {
      let imagePath = "/screenshots/" + utils_common.getTimeStamp() + ".png";
      await takeScreenshot(globalConfig.spec.resultFolder + imagePath);
      contMsg.img = "." + imagePath;
   }

   contextMessages.push(contMsg);

   assert.fail(value);
}

export function addToContext(testContext: Mocha.Context) {
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
