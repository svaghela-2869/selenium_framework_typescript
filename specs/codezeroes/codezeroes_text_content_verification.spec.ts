const yargs = require("yargs").argv;

import * as reporter from "../../lib/commom/reporter";
import * as utils_common from "../../lib/commom/utils_common";
import * as globalConfig from "../../lib/commom/config";
import { assert } from "chai";

it("Spec Info", async function () {
  await reporter.add_to_context(this);
});

before(async function () {
  await utils_common.init(yargs, __dirname, __filename);

  // let values_to_check: string[] = ["Programming Languages for Blockchain Development", "Mastering blockchain innovation with expert programming languages - trust Codezeros to lead the way.", "Top Languages for", "Blockchain Development", "Transform your blockchain vision into reality with our premier programming languages.", "Move", "Move is a secure programming language developed by Facebook for writing smart contracts on the Diem blockchain. It's designed to be platform-agnostic, enabling libraries and tools to be used across various blockchains with different data and execution models.", "Rust", "Rust was developed by Mozilla Corporation and initially released in 2010, is a fast and reliable programming language known for its strong memory safety and thread safety guarantees. It is used in blockchain development for building secure and high-performance nodes, consensus algorithms, and DApps.", "Solidity", "Solidity is a programming language developed by the Ethereum Foundation and released in 2015. It is a fastest-growing blockchain programming language used for developing smart contracts on the Ethereum blockchain, enabling trustless and automated execution of transactions and agreements on the blockchain.", "Vyper", "Vyper is a smart contract programming language used for developing secure and efficient smart contracts on the Ethereum blockchain. It's an alternative to Solidity, addressing the security and complexity concerns of the language. Vyper's simplicity makes it easier to review and maintain code, and its security focus is important for blockchain apps where security is paramount.", "Haskell", "Haskell is a functional programming language known for its strong static typing and mathematical approach. It is used in blockchain development for smart contract verification and formal verification of code. Haskell gained popularity as a primary programming language used in the renowned Cardano Blockchain.", "GoLang", "Go (or Golang) is a programming language developed by Google, is often used in blockchain development because of its concurrency and memory efficiency, making it a popular choice for building blockchain nodes, consensus mechanisms, smart contracts, and decentralized applications (DApps).", "Python", "Python is a popular high-level programming language known for its simplicity, readability, and ease of use. It's used in blockchain development for building smart contracts, DApps, and blockchain nodes. Its rich library ecosystem and community support make it a flexible language for blockchain development.", "Kotlin", "Kotlin can be used to develop smart contracts for blockchain platforms such as Ethereum, Hyperledger, and Corda. Kotlin's interoperability with Java makes it a popular choice for developing blockchain applications that require high performance, security, and scalability.", "Our Approach", "Our Approach to", "Our blockchain app development approach, emphasizing innovation and efficiency with latest programming languages, provides a competitive edge to clients.", "Choose the Appropriate Programming Language", "We select the best programming language for the project based on the client's requirements, the project's complexity, and the expertise of the development team.", "Implement Agile Development Methodology", "We use an Agile development approach that prioritizes collaboration, flexibility, and iterative development to deliver high-quality blockchain applications.", "Continuous Integration and Deployment", "We use CI/CD tools to automate the build, testing, and deployment process. This ensures that your blockchain application is always up-to-date and running smoothly.", "Ensure Code Quality and Security", "We conduct regular code reviews, security testing, and quality assurance checks. Also, our in-house security audits of smart contracts identify and eliminate vulnerabilities, ensuring clients receive secure & bug-free solutions.", "Hire Blockchain Programming language Experts to future-proof your blockchain project.", "Invest in blockchain projects with our expert programming language developers, guaranteeing sustainable and reliable solutions.", "Coding Standards", "We set the bar high with our coding standards, delivering only the best results.", "Clean Code:", "We write clean, readable, and maintainable code to ensure scalability, efficiency, reducing risk of errors and bugs.", "Modular Architecture:", "Our experts design apps with a modular architecture, allowing for flexibility to be easily modified, extended, and tested.", "Test-Driven Development:", "We ensure that each functionality is tested thoroughly before integration to ensure reliability and stability, reducing the risk of bugs and errors.", "Security Best Practices:", "We take security seriously and follow the latest security best practices that include secure coding techniques, encryption, and access control, to ensure the safety and protection of sensitive data.", "Latest Blogs", "Read our blogs to stay up-to-date on the latest news and insights from the world of software development."];
  let api_calls_to_make = await utils_common.get_all_api_calls(globalConfig.spec.csv);

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
        console.log("step : " + JSON.stringify(step));
        (step.zeroColumn == "skip" ? xit : it)(step.description || "step", async function () {
          await reporter.info(step.name);
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
