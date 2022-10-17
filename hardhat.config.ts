import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/WETH-tasks.ts";
import * as dotenv from "dotenv";
dotenv.config();

const SEPOLIA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`;
const GOERLI_URL = `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: SEPOLIA_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url: GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;

// console.log(process.env.PRIVATE_KEY);

// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// import * as dotenv from "dotenv";
// dotenv.config();

// const ALCHEMY_PROJECT_ID = process.env.ALCHEMY_PROJECT_ID;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// const config: HardhatUserConfig = {
//   solidity: "0.8.17",
//   networks: {
//     ropsten: {
//       url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_PROJECT_ID}`,
//       accounts:
//         process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//     },
//     rinkeby: {
//       url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}` || "",
//       accounts:
//         process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//     },
//     sepolia: {
//       url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}` || "",
//       accounts:
//         process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
//   gasReporter: {
//     enabled: process.env.REPORT_GAS !== undefined,
//     currency: "USD",
//   },
//   etherscan: {
//     apiKey: ETHERSCAN_API_KEY,
//   },
// };

// export default config;
