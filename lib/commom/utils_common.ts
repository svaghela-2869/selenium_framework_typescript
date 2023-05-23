import * as globalConfig from "./config";
import * as reporter from "./reporter";
import * as fs from "fs";

export function getTimeStamp() {
   const runDate = new Date();
   return String(runDate.getFullYear() + "_" + String(Number(runDate.getMonth() + 1)).padStart(2, "0") + "_" + String(runDate.getDate()).padStart(2, "0") + "T" + String(runDate.getHours()).padStart(2, "0") + "_" + String(runDate.getMinutes()).padStart(2, "0") + "_" + String(runDate.getSeconds()).padStart(2, "0") + "_" + String(runDate.getMilliseconds()).padStart(3, "0"));
}

export function getRandomNumber(minimumNumber: number, maximumNumber: number): number {
   return Math.floor(Math.random() * (maximumNumber - minimumNumber + 1) + minimumNumber);
}

export function close_driver() {
   const waitTill = new Date(new Date().getTime() + 2000);
   while (waitTill > new Date()) {}
   globalConfig.driver.close();
}

export function quit_driver() {
   const waitTill = new Date(new Date().getTime() + 5000);
   while (waitTill > new Date()) {}
   globalConfig.driver.quit();
}

export function init(arg: any, dirPath: string, filePath: string) {
   console.log("\n" + JSON.stringify(arg) + "\n");

   globalConfig.spec["name"] = filePath.replace(dirPath + "/", "");

   let ro = String(arg["reporter-options"]).split(",");
   ro.forEach(function (o: string) {
      if (o.startsWith("reportDir")) {
         globalConfig.spec["resultFolder"] = o.replace("reportDir=", "");
      }
   });

   if (!fs.existsSync(globalConfig.spec.resultFolder + "/screenshots")) {
      fs.mkdirSync(globalConfig.spec.resultFolder + "/screenshots", { recursive: true });
   }

   if (!fs.existsSync(globalConfig.spec.resultFolder + "/downloads")) {
      fs.mkdirSync(globalConfig.spec.resultFolder + "/downloads", { recursive: true });
   }

   console.log(JSON.stringify(globalConfig.spec) + "\n");

   reporter.setLogger();
   globalConfig.set_driver(arg.browser, arg.parallelRun);
}
