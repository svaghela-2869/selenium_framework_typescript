import * as globalConfig from "./config";
import * as reporter from "./reporter";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import "./extentions";

const dateFormat = require("dateformat");
const papa = require("papaparse");
const _ = require("lodash");

export function get_time_stamp(format: string = "yyyymmddHHMMss") {
  return dateFormat(format);
}

export function get_random_number(minimumNumber: number, maximumNumber: number): number {
  return Math.floor(Math.random() * (maximumNumber - minimumNumber + 1) + minimumNumber);
}

export async function init(arg: any, dirPath: string, filePath: string) {
  console.log("\n" + JSON.stringify(arg) + "\n");

  globalConfig.spec["name"] = filePath.replace(dirPath + "/", "").replace(".spec.ts", "");
  if (os.type().toLocaleLowerCase().startsWith("win")) {
    globalConfig.spec["name"] = filePath.replace(dirPath + "\\", "").replace(".spec.ts", "");
  }

  globalConfig.spec.abspath = path.resolve(__dirname, "../../../selenium_framework_typescript");
  globalConfig.spec["ts"] = filePath;
  globalConfig.spec["csv"] = filePath.replace(".ts", ".csv");

  let ro = String(arg["reporter-options"]).split(",");
  ro.forEach(function (o: string) {
    if (o.startsWith("reportDir")) {
      globalConfig.spec["resultFolder"] = o.replace("reportDir=", "");
    }
  });

  if (!fs.existsSync(globalConfig.spec.resultFolder + "/screenshots")) {
    fs.mkdirSync(globalConfig.spec.resultFolder + "/screenshots", {
      recursive: true,
    });
  }

  if (!fs.existsSync(globalConfig.spec.resultFolder + "/downloads")) {
    fs.mkdirSync(globalConfig.spec.resultFolder + "/downloads", {
      recursive: true,
    });
  }

  console.log(JSON.stringify(globalConfig.spec, null, 2) + "\n");

  reporter.set_logger();

  await reporter.info("Spec [ " + globalConfig.spec.ts + " ]");
  await reporter.info("Data [ " + globalConfig.spec.csv + " ]");
  await reporter.info("Browser [ " + arg.browser + " ]");

  let docker = String(arg["docker"]);
  if (docker == "true") {
    await globalConfig.set_driver(arg.browser, "true");
  } else {
    await globalConfig.set_driver(arg.browser, "false");
  }
}

export async function sleep(seconds: number) {
  const waitTill = new Date(new Date().getTime() + Number(seconds * 1000));
  while (waitTill > new Date()) {}
}

export async function get_all_api_calls(data_file: string) {
  let new_api_calls: any[] = [];
  let invalid_csv = false;

  if (fs.existsSync(data_file)) {
    let available_apis_to_call = await get_api_list();

    let csv_string = fs.readFileSync(data_file).toString();
    let csv_apis_data = papa.parse(csv_string, { delimiter: "," });
    let csv_apis = csv_apis_data.data;

    for (let i = 0; i < csv_apis.length; i++) {
      let step = csv_apis[i];
      let newStep: any = {};

      if (step && step.length > 0) {
        let firstColumn = _.first(step);
        if (firstColumn.toString().equalsIgnoreCase("skip")) {
          newStep["zeroColumn"] = firstColumn;
          step = _.drop(step);
          firstColumn = _.first(step).trim();
        }

        let api = _.find(available_apis_to_call, function (item: any) {
          return String(item.name.toString().equalsIgnoreCase(firstColumn));
        });

        if (api) {
          newStep["name"] = api.name;
          newStep["path"] = api.path;
          newStep["description"] = api.description;
          newStep["data"] = _.drop(step);
          new_api_calls.push(newStep);
        } else {
          await reporter.fail_and_continue("Method '" + firstColumn + "' does not exists, please check and update csv !!!");
          invalid_csv = true;
        }
      }
    }
  } else {
    await reporter.fail("csv data file not found !!!");
  }

  if (invalid_csv) {
    console.log("invalid csv !!!");
    return [];
  } else {
    return new_api_calls;
  }
}

async function get_api_list() {
  let apis = JSON.parse(fs.readFileSync(path.resolve(__dirname + "../../../api_list_common_details.json"), "utf-8")).apis;
  return apis;
}

export async function executeStep(step: any) {
  await reporter.info("Step [ " + step.name + " ]", false);
  await reporter.info("Data [ " + step.data + " ]", false);

  let dataMap = await convertStepArrayToMap(step.data);
  let apiToCall = step.name;
  let libPath = globalConfig.spec.abspath + "/" + step.path;
  let apis: any = await import(libPath);

  if (apis[apiToCall]) {
    if (step.path.includes("uihelper")) {
      let argsArray: any[] = [];
      dataMap.forEach((value) => {
        argsArray.push(value);
      });
      await apis[apiToCall].apply(apis, argsArray);
    } else {
      await apis[apiToCall].call(apis, dataMap);
    }
  } else {
    await reporter.fail_and_continue("Method '" + step.name + "' does not exists, please check and update csv !!!");
  }
}

async function convertStepArrayToMap(data: string[]) {
  let map = new Map();

  for (let i = 0; i < data.length; i++) {
    let d = data[i].trim();
    if (d.includes("=")) {
      let key = d.substring(0, d.indexOf("=")).trim();
      let value = d.substring(d.indexOf("=") + 1).trim();
      if (value != "") {
        map.set(key, value);
      }
    } else {
      map.set("arg" + i, d);
    }
  }

  return map;
}
