import * as fs from "fs";
import { get_time_stamp, sleep } from "../utils_common";
import * as os from "os";
import * as path from "path";

function run_spec() {
  let system = os.type().toLowerCase();
  const sel_runnner = fs.readFileSync(path.resolve(__filename, "../../../../selenium-runner.txt"), "utf-8");
  const spec_array = sel_runnner.split("\n");
  const spec_array_with_result_folder: string[] = [];
  const spec_array_with_final_cmd: string[] = [];

  console.log("Below spec files / folders will be run parallelly.\n");

  for (let i = 0; i < spec_array.length; i++) {
    console.log(spec_array[i]);
    let supportedBrowsers = ["chrome", "firefox", "edge"];
    if (!supportedBrowsers.includes(spec_array[i].split(" => ")[0])) {
      console.log("\nPlease select parallel runs supported browsers : " + supportedBrowsers.toString());
      return;
    }
    let split = "/";
    if (system.startsWith("win")) {
      split = "\\\\";
    }
    let name_index = spec_array[i].split(" => ")[1].split(split).length;
    let spec_run_data;
    if (spec_array[i].includes("**")) {
      spec_run_data = spec_array[i] + " => " + get_time_stamp() + " => " + spec_array[i].split(" => ")[1].split(split)[name_index - 3].split(".")[0];
    } else {
      spec_run_data = spec_array[i] + " => " + get_time_stamp() + " => " + spec_array[i].split(" => ")[1].split(split)[name_index - 1].split(".")[0];
    }
    spec_array_with_result_folder.push(spec_run_data);
    sleep(1.3);
  }

  // console.log(spec_array_with_result_folder);

  console.log("\nTotal spec files / folders found : " + spec_array_with_result_folder.length);

  for (let i = 0; i < spec_array_with_result_folder.length; i++) {
    if (spec_array_with_result_folder[i].split(" => ").length == 4) {
      let baseCommand = "npx mocha --require 'ts-node/register' --browser chrome --diff true --full-trace true --no-timeouts --reporter mochawesome --reporter-options 'reportDir=results/_parallel/TEMP_RESULT_FOLDER_TEMP,reportFilename='selenium-report',reportPageTitle='Mochawesome',embeddedScreenshots=true,charts=true,html=true,json=false,overwrite=true,inlineAssets=true,saveAllAttempts=false,code=false,quiet=false,ignoreVideos=true,showPending=true,autoOpen=false' --spec ";
      baseCommand = baseCommand.replace("--browser chrome", "--browser " + spec_array_with_result_folder[i].split(" => ")[0]);
      baseCommand = baseCommand + spec_array_with_result_folder[i].split(" => ")[1].replaceAll("\\\\", "/");
      baseCommand = baseCommand.replace("TEMP_RESULT_FOLDER_TEMP", spec_array_with_result_folder[i].split(" => ")[3] + "/" + spec_array_with_result_folder[i].split(" => ")[2]);
      let final_result_folder = "results/_parallel/" + spec_array_with_result_folder[i].split(" => ")[3] + "/" + spec_array_with_result_folder[i].split(" => ")[2];
      if (!fs.existsSync(final_result_folder)) {
        fs.mkdirSync(final_result_folder, { recursive: true });
      }
      spec_array_with_final_cmd.push(baseCommand + " > '" + final_result_folder + "/selenium-log.txt'");
    } else {
      console.error("\nPlease check selenium-runner.txt for error...");
      return;
    }
  }

  //    console.log(spec_array_with_final_cmd);

  let final_cmd = "";
  for (let i = 0; i < spec_array_with_final_cmd.length; i++) {
    if (i != spec_array_with_final_cmd.length - 1) {
      spec_array_with_final_cmd[i] = spec_array_with_final_cmd[i] + " & ";
    }
    final_cmd = final_cmd + spec_array_with_final_cmd[i];
  }

  // console.log(spec_array_with_final_cmd);

  fs.writeFileSync("./lib/commom/runner/run.txt", final_cmd);

  console.log("\n==================== Selenium Report Files ====================\n");

  for (let i = 0; i < spec_array_with_result_folder.length; i++) {
    let report_folder_path = "../../../results/_parallel/" + spec_array_with_result_folder[i].split(" => ")[3] + "/" + spec_array_with_result_folder[i].split(" => ")[2];
    let report = path.resolve(__dirname, String(report_folder_path + "/selenium-report.html"));
    let log = path.resolve(__dirname, String(report_folder_path + "/selenium-log.txt"));
    if (system.startsWith("win")) {
      log = log.replaceAll("/", "\\\\");
      log = log.replaceAll("/", "\\\\");
    }
    console.log(log);
    console.log(report + "\n");
  }

  console.log("Running specs...");

  return;
}

run_spec();
