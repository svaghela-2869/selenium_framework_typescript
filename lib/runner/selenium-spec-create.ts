import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import "../commom/extentions";

function run_spec_create() {
  let is_created = false;
  const sel_runnner = fs.readFileSync(path.resolve(__filename, "../../../selenium-spec-create.txt"), "utf-8");
  const spec_array = sel_runnner.split("\n");

  for (let i = 0; i < spec_array.length; i++) {
    if (spec_array[i].startsWith("##") || !spec_array[i]) {
      continue;
    }

    let split = "/";
    if (os.type().toLocaleLowerCase().startsWith("win")) {
      split = "\\\\";
    }

    let dynamic_import_count = spec_array[i].split(" => ")[0].split(split).length;

    console.log("\nGenerating Files For Spec : " + spec_array[i] + "\n");

    let spec_folder = path.resolve(__dirname, "../../" + spec_array[i].split(" => ")[0]);
    let spec_runner_file = path.resolve(__dirname, spec_folder + "/" + spec_array[i].split(" => ")[1] + ".ts");
    let spec_data_file = path.resolve(__dirname, spec_folder + "/" + spec_array[i].split(" => ")[1] + ".csv");

    if (!fs.existsSync(spec_folder)) {
      fs.mkdirSync(spec_folder, { recursive: true });
      console.log("folder created : " + spec_folder);
      is_created = true;
    } else {
      console.log("folder already exists : " + spec_folder);
      is_created = true;
    }

    let dynamic_import_string = "";

    for (let i = 0; i < dynamic_import_count; i++) {
      dynamic_import_string = dynamic_import_string + "../";
    }

    if (!fs.existsSync(spec_runner_file)) {
      let spec_ruuner_data = "import { spec_runner } from " + '"' + dynamic_import_string + 'lib/commom/generic_spec_runner"' + ";\n" + "const yargs = require(" + '"yargs"' + ").argv;\n" + "spec_runner(yargs, __dirname, __filename);\n";

      fs.writeFileSync(spec_runner_file, spec_ruuner_data);
      console.log("spec runner created : " + spec_runner_file);
      is_created = true;
    } else {
      console.log("spec runner already exists : " + spec_runner_file);
      is_created = true;
    }

    if (!fs.existsSync(spec_data_file)) {
      fs.writeFileSync(spec_data_file, "");
      console.log("spec data created : " + spec_data_file);
      is_created = true;
    } else {
      console.log("spec data already exists : " + spec_data_file);
      is_created = true;
    }
  }

  return is_created;
}

run_spec_create();
