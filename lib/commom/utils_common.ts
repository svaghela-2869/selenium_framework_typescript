import * as globalConfig from "./config";
import * as reporter from "./reporter";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import "./extentions";

const dateFormat = require("dateformat");
const papa = require("papaparse");
const _ = require("lodash");
const parse_xml_to_string = require("xml2js").parseString;
const ignore_case = require("ignore-case");

export function get_time_stamp(format: string = "yyyymmddHHMMss") {
    return dateFormat(format).toString();
}

export function get_random_number(minimumNumber: number, maximumNumber: number): number {
    return Math.floor(Math.random() * (maximumNumber - minimumNumber + 1) + minimumNumber);
}

export async function init(arg: any, dirPath: string, filePath: string) {
    console.log("\n" + JSON.stringify(arg) + "\n");

    const env_xml = path.resolve(__dirname, "../../env_vars.xml");
    if (fs.existsSync(env_xml)) {
        console.log("loading env_vars from xml...\n");
        load_env_xml(env_xml);
    } else {
        await reporter.warn("Not able find env xml [ " + path.resolve(__dirname, env_xml) + " ]");
    }

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

    console.log(JSON.stringify(globalConfig.spec) + "\n");

    reporter.set_logger();

    await reporter.info("Spec [ " + globalConfig.spec.ts + " ]");
    await reporter.info("Data [ " + globalConfig.spec.csv + " ]");
    await reporter.info("XS [ " + globalConfig.env_vars.XS + " ]");

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
        let csv_apis_data_formatted = format_csv_data(csv_apis_data.data);
        let csv_apis = csv_apis_data_formatted;

        // console.log(JSON.stringify(csv_apis, null, 4));

        for (let i = 0; i < csv_apis.length; i++) {
            let step = csv_apis[i];
            let newStep: any = {};

            if (step && step.length > 0) {
                let firstColumn = _.first(step);

                if (firstColumn.startsWith("##")) {
                    continue;
                } else if (firstColumn.toString().equalsIgnoreCase("skip")) {
                    newStep["zeroColumn"] = firstColumn;
                    step = _.drop(step);
                    firstColumn = _.first(step).trim();
                }

                let api = _.find(available_apis_to_call, function (item: any) {
                    return Boolean(item.name.toString().equalsIgnoreCase(firstColumn));
                });

                if (api) {
                    newStep["name"] = api.name;
                    newStep["path"] = api.path;
                    newStep["description"] = api.description;
                    newStep["data"] = _.drop(step);
                    new_api_calls.push(newStep);
                } else {
                    reporter.logger.error("method '" + firstColumn + "' does not exists, please check and update csv !!!");
                    invalid_csv = true;
                }
            }
        }
    } else {
        await reporter.fail("csv data file not found !!!");
    }

    if (invalid_csv) {
        reporter.logger.error("invalid csv !!!");
        return [];
    } else {
        return new_api_calls;
    }
}

async function get_api_list() {
    let apis = JSON.parse(fs.readFileSync(path.resolve(__dirname + "../../../api_list_common_details.json"), "utf-8")).apis;
    return apis;
}

export async function execute_step(step: any) {
    await reporter.info("Step [ " + step.name + " ]", false);
    await reporter.info("Data [ " + step.data + " ]", false);

    let dataMap = convert_step_array_to_map(step.data);

    // console.log(dataMap);

    let api_to_call = step.name;
    let libPath = globalConfig.spec.abspath + "/" + step.path;
    let apis: any = await import(libPath);

    if (apis[api_to_call]) {
        if (step.path.includes("uihelper")) {
            let argsArray: any[] = [];
            dataMap.forEach((value) => {
                argsArray.push(value);
            });
            await apis[api_to_call].apply(apis, argsArray);
        } else {
            await apis[api_to_call].call(apis, dataMap);
        }
    } else {
        await reporter.fail_and_continue("method '" + step.name + "' does not exists, please check and update csv !!!");
    }
}

function convert_step_array_to_map(data: string[]) {
    let map = new Map();

    // console.log(data);

    for (let i = 0; i < data.length; i++) {
        let d = data[i].trim();
        if (d.includes("==")) {
            let key = d.split("==")[0];
            let value = d.replace(key + "==", "").trim();
            if (value != "") {
                map.set(key, value);
            }
        } else {
            map.set("arg" + i, d);
        }
    }

    // console.log(map);

    return map;
}

function format_csv_data(csv_apis_data: any) {
    let csv_apis_data_formatted: any = [];
    let map = new Map();
    map.set("xs", globalConfig.env_vars.XS);

    for (let i = 0; i < csv_apis_data.length; i++) {
        let new_row: string[] = [];
        let csv_row = csv_apis_data[i];
        for (let j = 0; j < csv_row.length; j++) {
            let cell = csv_row[j];
            if (cell && cell.trim() !== "") {
                map.forEach((value, key) => {
                    if (ignore_case.includes(cell, "{{" + key + "}}")) {
                        let replace_value = new RegExp("\\{\\{" + key + "\\}\\}", "gi");
                        cell = cell.replace(replace_value, value);
                    }
                });
                new_row.push(cell);
            }
        }
        csv_apis_data_formatted.push(new_row);
    }
    return csv_apis_data_formatted;
}

function load_env_xml(env_file: string) {
    let env_file_string = fs.readFileSync(env_file).toString();

    // console.log(env_file_string);

    parse_xml_to_string(env_file_string, function (err: any, result: any) {
        let env_vars_from_xml = result["Environment"]["Variable"];
        env_vars_from_xml.forEach(async function (evar: any) {
            let name = evar.Name;
            let value = evar.Value;
            if (!globalConfig.env_vars[name]) {
                await reporter.debug(name + "==" + value);
                globalConfig.env_vars[name] = value[0];
            }
        });
    });
}
