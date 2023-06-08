import * as fs from "fs";
import { get_time_stamp, sleep } from "../utils_common";
import * as path from "path";

const system = require("node-uname");

function run_spec() {
  const sel_runnner = fs.readFileSync(path.resolve(__filename, "../../../../selenium-runner.txt"), "utf-8");
  const spec_array = sel_runnner.split("\n");
  const spec_array_with_result_folder: string[] = [];
  const spec_array_with_final_cmd: string[] = [];

  let supportedBrowsers = ["chrome", "firefox", "edge"];
  let unsupported_browser = false;

  console.log("Below spec files / folders will be run serially in docker.\n");

  for (let i = 0; i < spec_array.length; i++) {
    console.log(spec_array[i]);

    if (!supportedBrowsers.includes(spec_array[i].split(" => ")[0])) {
      spec_array[i] = spec_array[i].replace(spec_array[i].split(" => ")[0], "chrome");
      unsupported_browser = true;
    }

    let name_index = spec_array[i].split(" => ")[1].split("/").length;
    let spec_run_data: string;

    if (spec_array[i].includes("**")) {
      spec_run_data = spec_array[i] + " => " + get_time_stamp() + " => " + spec_array[i].split(" => ")[1].split("/")[name_index - 3].split(".")[0];
    } else {
      spec_run_data = spec_array[i] + " => " + get_time_stamp() + " => " + spec_array[i].split(" => ")[1].split("/")[name_index - 1].split(".")[0];
    }

    spec_array_with_result_folder.push(spec_run_data);

    sleep(1.3);
  }

  // console.log(spec_array_with_result_folder);

  console.log("\nTotal spec files / folders found : " + spec_array_with_result_folder.length);

  if (unsupported_browser) {
    console.log("\nWarning : Please select docker serial runs supported browsers : " + supportedBrowsers.toString() + ", for current run defaulting to chrome...");
  }

  for (let i = 0; i < spec_array_with_result_folder.length; i++) {
    if (spec_array_with_result_folder[i].split(" => ").length == 4) {
      let baseCommand = "npx mocha --require 'ts-node/register' --browser chrome --diff true --full-trace true --no-timeouts --reporter mochawesome --reporter-options 'reportDir=results/_docker/TEMP_RESULT_FOLDER_TEMP,reportFilename='selenium-report',reportPageTitle='Mochawesome',embeddedScreenshots=true,charts=true,html=true,json=false,overwrite=true,inlineAssets=true,saveAllAttempts=false,code=false,quiet=false,ignoreVideos=true,showPending=true,autoOpen=false' --spec ";

      baseCommand = baseCommand.replace("--browser chrome", "--docker true --browser " + spec_array_with_result_folder[i].split(" => ")[0]);
      baseCommand = baseCommand + spec_array_with_result_folder[i].split(" => ")[1];
      baseCommand = baseCommand.replace("TEMP_RESULT_FOLDER_TEMP", spec_array_with_result_folder[i].split(" => ")[3] + "/" + spec_array_with_result_folder[i].split(" => ")[2]);

      let final_result_folder = "results/_docker/" + spec_array_with_result_folder[i].split(" => ")[3] + "/" + spec_array_with_result_folder[i].split(" => ")[2];
      if (!fs.existsSync(final_result_folder)) {
        fs.mkdirSync(final_result_folder, { recursive: true });
      }

      if (!fs.existsSync(final_result_folder + "/recordings")) {
        fs.mkdirSync(final_result_folder + "/recordings", { recursive: true });
      }

      let docker_image = "selenium/node-" + spec_array_with_result_folder[i].split(" => ")[0] + ":latest";
      if (String(system.uname().machine).toLowerCase() == "arm64") {
        let browser = spec_array_with_result_folder[i].split(" => ")[0];
        if (browser.toLowerCase() == "chrome") {
          docker_image = "seleniarm/node-chromium:latest";
        } else if (browser.toLowerCase() == "firefox") {
          docker_image = "seleniarm/node-firefox:latest";
        } else if (browser.toLowerCase() == "edge") {
          console.log("\nedge is not yet supported in arm64.");
          return;
        }
      }
      spec_array_with_final_cmd.push(spec_array_with_result_folder[i].split(" => ")[3] + "`" + docker_image + "`" + final_result_folder + "`" + baseCommand + " &> '" + final_result_folder + "/selenium-log.txt'");
    } else {
      console.error("\nPlease check selenium-runner.txt for error...");
      return;
    }
  }

  // console.log(spec_array_with_final_cmd);

  for (let i = 0; i < spec_array_with_final_cmd.length; i++) {
    spec_array_with_final_cmd[i] = spec_array_with_final_cmd[i] + "\n";
  }

  // console.log(spec_array_with_final_cmd);

  if (String(system.uname().machine).toLowerCase() == "arm64") {
    fs.writeFileSync("./lib/commom/runner/run.txt", "seleniarm\n" + spec_array_with_final_cmd.toString().replaceAll("\n,", "\n"));
  } else {
    fs.writeFileSync("./lib/commom/runner/run.txt", "selenium\n" + spec_array_with_final_cmd.toString().replaceAll("\n,", "\n"));
  }

  // fs.writeFileSync("./lib/commom/runner/run.txt", system.uname().machine.toLowerCase() + "\n" + spec_array_with_final_cmd.toString().replaceAll("\n,", "\n"));

  console.log("\n==================== Selenium Report Files ====================\n");

  for (let i = 0; i < spec_array_with_result_folder.length; i++) {
    let report_folder_path = path.resolve(__dirname, "../../../results/_docker/" + spec_array_with_result_folder[i].split(" => ")[3] + "/" + spec_array_with_result_folder[i].split(" => ")[2]);
    let report = String(report_folder_path + "/selenium-report.html");
    let log = String(report_folder_path + "/selenium-log.txt");

    console.log(log);
    console.log(report + "\n");
  }

  return;
}

run_spec();
