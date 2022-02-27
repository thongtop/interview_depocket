const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BEP20Token", function () {
  it("", async function () {
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
    
    console.log("========= Transfer token to manage contract ===========");
    //token.transfer(manage.address, BigInt(50*10**18));
    console.log('');
    console.log("Wallet owner:        ", owner.address, "Token balance: ", (await token.balanceOf(owner.address))  ) ;
    console.log("Magane contract:     ", manage.address, "Token balance: ", (await token.balanceOf(manage.address))  ) ;
    console.log("Wallet director:     ", addr1.address, "Token balance: ", (await token.balanceOf(addr1.address))  ) ;
    console.log("Wallet viceDirector: ", addr2.address, "Token balance: ", (await token.balanceOf(addr2.address))  ) ;
    console.log("Wallet accountant:   ", addr3.address, "Token balance: ", (await token.balanceOf(addr3.address))  ) ;
    console.log("Wallet member:       ", addr4.address, "Token balance: ", (await token.balanceOf(addr4.address))  ) ;

    console.log("========= Set up manage contract ===========");
    await manage.setTokenAddress(token.address);
    await manage.setDirector(addr1.address);
    await manage.setViceDirector(addr2.address);
    await manage.setAccountant(addr3.address);
    
    await manage.set_director_amount_transfer(BigInt(1001*10**18));
    await manage.set_viceDirector_amount_transfer(BigInt(501*10**18));
    
    await token.approve(manage.address, BigInt(1000000000*10**18));
    console.log("=== Test deposit token to manage contract===")
    await manage.deposit_token(ethers.utils.parseEther("1000.0"));
    console.log("Magane contract:     ", manage.address, "Token balance: ", (await token.balanceOf(manage.address))  ) ;
    
    console.log("=== Test director withdraw all balance of manage  ===")
    await manage.connect(addr1).withdrawAllTokens(token.address);
    console.log("Magane contract:     ", manage.address, "Token balance: ", (await token.balanceOf(manage.address))  ) ;

    
    await manage.deposit_token(ethers.utils.parseEther("1000000.0"));
    console.log("=== Test director transfer  ===")
    await manage.connect(addr1).Director_transfer(addr4.address, ethers.utils.parseEther("1000.0"));
    console.log("Magane contract:     ", manage.address, "Token balance: ", (await token.balanceOf(manage.address))  ) ;
    console.log("Wallet member:       ", addr4.address, "Token balance: ", (await token.balanceOf(addr4.address))  ) ;
    
    console.log("=== Test viceDirector transfer  ===")
    await manage.connect(addr2).viceDirector_transfer(addr4.address, ethers.utils.parseEther("500.0"));
    console.log("Magane contract:     ", manage.address, "Token balance: ", (await token.balanceOf(manage.address))  ) ;
    console.log("Wallet member:       ", addr4.address, "Token balance: ", (await token.balanceOf(addr4.address))  ) ;

});
})