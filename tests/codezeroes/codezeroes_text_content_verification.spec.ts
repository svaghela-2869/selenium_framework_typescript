const yargs = require("yargs").argv;

import * as reporter from "../../lib/commom/reporter";
import * as utils_common from "../../lib/commom/utils_common";
import * as uihelper from "../../lib/commom/uihelper";
import * as globalConfig from "../../lib/commom/config";
import { assert } from "chai";

const test = String(__filename.split("/").pop());

describe(test, async function () {
  //setting up basic details for running the spec
  before(function () {
    utils_common.init(yargs, __dirname, __filename);
  });

  beforeEach(function () {
    reporter.clear_context();
  });

  it("Programming Languages for Blockchain Development", async function () {
    await uihelper.launch_url("https://app.codezeros.com/blockchain-programming-languages");
    await uihelper.verify_read_only_text("Programming Languages for Blockchain Development");
    await uihelper.verify_read_only_text("Mastering blockchain innovation with expert programming languages - trust Codezeros to lead the way.");
    await uihelper.verify_read_only_text("Top Languages for ");
    await uihelper.verify_read_only_text("Blockchain Development");
    await uihelper.verify_read_only_text("Transform your blockchain vision into reality with our premier");
    await uihelper.verify_read_only_text("programming languages.");
    await uihelper.verify_read_only_text("Move");
    await uihelper.verify_read_only_text("Move is a secure programming language developed by Facebook for writing smart contracts on the Diem blockchain. It's designed to be platform-agnostic, enabling libraries and tools to be used across various blockchains with different data and execution models.");
    await uihelper.verify_read_only_text("Rust");
    await uihelper.verify_read_only_text("Rust was developed by Mozilla Corporation and initially released in 2010, is a fast and reliable programming language known for its strong memory safety and thread safety guarantees. It is used in blockchain development for building secure and high-performance nodes, consensus algorithms, and DApps.");
    await uihelper.verify_read_only_text("Solidity");
    await uihelper.verify_read_only_text("Solidity is a programming language developed by the Ethereum Foundation and released in 2015. It is a fastest-growing blockchain programming language used for developing smart contracts on the Ethereum blockchain, enabling trustless and automated execution of transactions and agreements on the blockchain.");
    await uihelper.verify_read_only_text("Vyper");
    await uihelper.verify_read_only_text("Vyper is a smart contract programming language used for developing secure and efficient smart contracts on the Ethereum blockchain. It's an alternative to Solidity, addressing the security and complexity concerns of the language. Vyper's simplicity makes it easier to review and maintain code, and its security focus is important for blockchain apps where security is paramount.");
    await uihelper.verify_read_only_text("Haskell");
    await uihelper.verify_read_only_text("Haskell is a functional programming language known for its strong static typing and mathematical approach. It is used in blockchain development for smart contract verification and formal verification of code. Haskell gained popularity as a primary programming language used in the renowned Cardano Blockchain.");
    await uihelper.verify_read_only_text("GoLang");
    await uihelper.verify_read_only_text("Go (or Golang) is a programming language developed by Google, is often used in blockchain development because of its concurrency and memory efficiency, making it a popular choice for building blockchain nodes, consensus mechanisms, smart contracts, and decentralized applications (DApps).");
    await uihelper.verify_read_only_text("Python");
    await uihelper.verify_read_only_text("Python is a popular high-level programming language known for its simplicity, readability, and ease of use. It's used in blockchain development for building smart contracts, DApps, and blockchain nodes. Its rich library ecosystem and community support make it a flexible language for blockchain development.");
    await uihelper.verify_read_only_text("Kotlin");
    await uihelper.verify_read_only_text("Kotlin can be used to develop smart contracts for blockchain platforms such as Ethereum, Hyperledger, and Corda. Kotlin's interoperability with Java makes it a popular choice for developing blockchain applications that require high performance, security, and scalability. ");
    await uihelper.verify_read_only_text("Our Approach");
    await uihelper.verify_read_only_text("Our Approach to");
    await uihelper.verify_read_only_text("Our blockchain app development approach, emphasizing innovation and efficiency with latest programming languages, provides a competitive edge to clients.");
    await uihelper.verify_read_only_text("Choose the Appropriate Programming Language");
    await uihelper.verify_read_only_text("We select the best programming language for the project based on the client's requirements, the project's complexity, and the expertise of the development team.");
    await uihelper.verify_read_only_text("Implement Agile Development Methodology");
    await uihelper.verify_read_only_text("We use an Agile development approach that prioritizes collaboration, flexibility, and iterative development to deliver high-quality blockchain applications.");
    await uihelper.verify_read_only_text("Continuous Integration and Deployment");
    await uihelper.verify_read_only_text("We use CI/CD tools to automate the build, testing, and deployment process. This ensures that your blockchain application is always up-to-date and running smoothly.");
    await uihelper.verify_read_only_text("Ensure Code Quality and Security");
    await uihelper.verify_read_only_text("We conduct regular code reviews, security testing, and quality assurance checks. Also, our in-house security audits of smart contracts identify and eliminate vulnerabilities, ensuring clients receive secure & bug-free solutions.");
    await uihelper.verify_read_only_text("Hire Blockchain Programming language Experts to future-proof your blockchain project.");
    await uihelper.verify_read_only_text("Invest in blockchain projects with our expert programming language developers, guaranteeing sustainable and reliable solutions.");
    await uihelper.verify_read_only_text("Coding Standards");
    await uihelper.verify_read_only_text("We set the bar high with our coding standards, delivering only the best results.");
    await uihelper.verify_read_only_text("Clean Code:");
    await uihelper.verify_read_only_text("We write clean, readable, and maintainable code to ensure scalability, efficiency, reducing risk of errors and bugs.");
    await uihelper.verify_read_only_text("Modular Architecture:");
    await uihelper.verify_read_only_text("Our experts design apps with a modular architecture, allowing for flexibility to be easily modified, extended, and tested.");
    await uihelper.verify_read_only_text("Test-Driven Development:");
    await uihelper.verify_read_only_text("We ensure that each functionality is tested thoroughly before integration to ensure reliability and stability, reducing the risk of bugs and errors.");
    await uihelper.verify_read_only_text("Security Best Practices:");
    await uihelper.verify_read_only_text("We take security seriously and follow the latest security best practices that include secure coding techniques, encryption, and access control, to ensure the safety and protection of sensitive data.");
    await uihelper.verify_read_only_text("Latest Blogs");
    await uihelper.verify_read_only_text("Read our blogs to stay up-to-date on the latest news and insights from the world of software development.");
    if (reporter.step_status.fail) {
      assert.fail(reporter.step_status.msg);
    }
  });

  afterEach(async function () {
    await reporter.add_to_context(this);
  });

  after(async function () {
    globalConfig.quit_driver();
  });
});
