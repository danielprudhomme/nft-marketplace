require('@nomiclabs/hardhat-waffle')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.9',
  paths: {
    artifacts: './src/artifacts',
    sources: './src/contracts',
    cache: './src/cache',
    tests: './src/test',
  },
}
