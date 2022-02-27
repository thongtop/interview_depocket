// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  
  
  let owner;
  let addr1;
  let addr2;
  let addr3;
  [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
  
  console.log("Wallet owner:        ", owner.address, "Account balance: ", (await owner.getBalance()).toString()  ) ;
  console.log("Wallet director:     ", addr1.address, "Account balance: ", (await addr1.getBalance()).toString()  ) ;
  console.log("Wallet viceDirector: ", addr2.address, "Account balance: ", (await addr2.getBalance()).toString()  ) ;
  console.log("Wallet accountant:   ", addr3.address, "Account balance: ", (await addr3.getBalance()).toString()  ) ;
  console.log("Wallet member:       ", addr4.address, "Account balance: ", (await addr3.getBalance()).toString()  ) ;


  console.log("========= Deploying token ===========");
  console.log('');
  const Token = await ethers.getContractFactory("BEP20Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);
  console.log("Bep20Token owner", await token.owner())

  console.log("========= Deploying manage contract ===========");
  console.log('');
  const Contract_manage = await ethers.getContractFactory("manage_contract");
  const manage = await Contract_manage.deploy();
  await manage.deployed();

  console.log("Contract manage address:", manage.address);
  console.log("Contract manage  owner", await manage.owner())
  
  console.log("========= Deploying manage contract ===========");
  token.transfer(addr1.address, 50);
  console.log('');
  console.log("Wallet owner:        ", owner.address, "Token balance: ", (await token.balanceOf(owner.address))  ) ;
  console.log("Wallet director:     ", addr1.address, "Token balance: ", (await token.balanceOf(addr1.address))  ) ;
  console.log("Wallet viceDirector: ", addr2.address, "Token balance: ", (await token.balanceOf(addr2.address))  ) ;
  console.log("Wallet accountant:   ", addr3.address, "Token balance: ", (await token.balanceOf(addr3.address))  ) ;
  console.log("Wallet member:       ", addr4.address, "Token balance: ", (await token.balanceOf(addr4.address))  ) ;

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
