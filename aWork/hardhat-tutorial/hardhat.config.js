require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */



const ALCHEMY_API_KEY = "KEY";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const PRIVATE_KEY_VAR = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.8.9",
        settings: { } 
      }
    ]
  },
  //solidity: "0.8.9",
  networks: {
    testnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`${PRIVATE_KEY_VAR}`]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      //accounts: [`${PRIVATE_KEY_VAR}`]
    },
  }
};

