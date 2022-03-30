require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: "./src/back/artifacts",
    sources: "./src/back/contracts",
    cache: "./src/back/cache",
    tests: "./src/back/test"
  },
};
