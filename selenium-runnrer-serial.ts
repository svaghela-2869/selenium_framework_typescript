import * as fs from "fs";
import { getTimeStamp, sleep } from "./lib/commom/utils_common";
import * as os from "os";

const cmd = require("node-cmd");

function run_spec() {
   const sel_runnner = fs.readFileSync("./selenium-runner.txt", "utf-8");
   const spec_array = sel_runnner.split("\n");
   const spec_array_with_result_folder: string[] = [];
   const spec_array_with_final_cmd: string[] = [];

   console.log("Below spec files / folders will be run serially.\n");

   for (let i = 0; i < spec_array.length; i++) {
      console.log(spec_array[i]);
      let spec_run_data = spec_array[i] + " => " + getTimeStamp();
      spec_array_with_result_folder.push(spec_run_data);
      sleep(1.3);
   }

   console.log("\nTotal spec files / folders found : " + spec_array_with_result_folder.length);

   for (let i = 0; i < spec_array_with_result_folder.length; i++) {
      if (spec_array_with_result_folder[i].split(" => ").length == 3) {
         let baseCommand = "npx mocha --require 'ts-node/register' --browser chrome --diff true --full-trace true --no-timeouts --reporter mochawesome --reporter-options 'reportDir=results/TEMP_RESULT_FOLDER_TEMP,reportFilename='selenium-report',reportPageTitle='Mochawesome',embeddedScreenshots=true,charts=true,html=true,json=true,overwrite=true,inlineAssets=true,saveAllAttempts=false,code=false,quiet=false,ignoreVideos=true,showPending=false,autoOpen=false' --spec ";
         baseCommand = baseCommand.replace("--browser chrome", "--browser " + spec_array_with_result_folder[i].split(" => ")[0]);
         baseCommand = baseCommand + spec_array_with_result_folder[i].split(" => ")[1];
         baseCommand = baseCommand.replace("TEMP_RESULT_FOLDER_TEMP", spec_array_with_result_folder[i].split(" => ")[2]);
         if (!fs.existsSync("results/" + spec_array_with_result_folder[i].split(" => ")[2])) {
            fs.mkdirSync("results/" + spec_array_with_result_folder[i].split(" => ")[2], { recursive: true });
         }
         spec_array_with_final_cmd.push(baseCommand);
      } else {
         console.error("\nPlease check selenium-runner.txt for error...");
         return;
      }
   }

   //    console.log(spec_array_with_final_cmd);

   let final_cmd = "";
   for (let i = 0; i < spec_array_with_final_cmd.length; i++) {
      if (i != spec_array_with_final_cmd.length - 1) {
         spec_array_with_final_cmd[i] = spec_array_with_final_cmd[i] + " && sleep 1 && ";
      }
      final_cmd = final_cmd + spec_array_with_final_cmd[i];
   }

   // console.log(spec_array_with_final_cmd);

   console.log("\nRunning specs...");

   cmd.run(final_cmd);

   console.log("\nReport will be as below when run complete...\n");

   for (let i = 0; i < spec_array_with_result_folder.length; i++) {
      let result_path = String("Report : " + (i + 1) + " => " + __dirname + "/results/" + spec_array_with_result_folder[i].split(" => ")[2] + "/selenium-report.html");
      let system = os.type().toLowerCase();
      if (system.startsWith("win")) {
         result_path = result_path.replaceAll("/", "\\\\");
      }
      console.log(result_path);
   }

   return;
}

run_spec();
