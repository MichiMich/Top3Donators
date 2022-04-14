const hre = require("hardhat");

export function getAccounts() {
    //should be dependend on used chain as well
    const accounts = await hre.ethers.getSigners();

    return (accounts);
}

export function deployContract() {
    const Top3Donators = await hre.ethers.getContractFactory("Top3Donators");
    const top3Donators = await Top3Donators.deploy();

    await top3Donators.deployed();


    return (top3Donators);

}