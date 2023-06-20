import * as reporter from "../../lib/commom/reporter";
import * as utils_common from "../../lib/commom/utils_common";
import * as globalConfig from "../../lib/commom/config";
import { assert } from "chai";

export function spec_runner(argv: any, dirname: string, filename: string) {
    it("Spec Info", async function () {
        await reporter.add_to_context(this);
    });

    before(async function () {
        await utils_common.init(argv, dirname, filename);
        const api_calls_to_make = await utils_common.get_all_api_calls(globalConfig.spec.csv);

        describe(globalConfig.spec.name, async function () {
            beforeEach(async function () {
                await reporter.clear_context();
                if (reporter.step_status.abort) {
                    this.skip();
                }
            });

            if (api_calls_to_make.length > 0) {
                for (let i = 0; i < api_calls_to_make.length; i++) {
                    const step = api_calls_to_make[i];
                    (step.zeroColumn == "skip" ? xit : it)(step.description, async function () {
                        await utils_common.execute_step(step);
                        if (reporter.step_status.fail) {
                            assert.fail(reporter.step_status.msg);
                        }
                    });
                }
            } else {
                it("nothing to run in spec data file !!!", async function () {
                    await reporter.fail("check selenium-log.txt for more details...");
                });
            }

            afterEach(async function () {
                await reporter.add_to_context(this);
            });
        });
    });

    after(async function () {
        await globalConfig.quit_driver();
    });
}
