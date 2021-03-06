const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("top3Donators", function () {

  beforeEach(async function () {
    accounts = await hre.ethers.getSigners();
    for (let i = 0; i < accounts.length; i++) {
      console.log("account ", i, ": ", accounts[i].address);
    }
    Top3Donators = await hre.ethers.getContractFactory("Top3Donators");
    top3Donators = await Top3Donators.deploy();

    await top3Donators.deployed();
    console.log("Top3Donators deployed to:", top3Donators.address);

  });


  it("revert too low amount", async function () {
    await expect(top3Donators.donate({ value: 1e14 })).to.be.reverted;
  });


  it("one donation and correct rank", async function () {
    const addDonator = await top3Donators.donate({ value: 1e15 })

    await addDonator.wait();

    const currentHighestDonators = await top3Donators.getHighestDonators();


    console.log("result of current highest donators: ", currentHighestDonators);
    console.log("first value", currentHighestDonators[0][0])
    //should now be the nr one at donators
    expect(currentHighestDonators[0][0]).to.equal(accounts[0].address);


  });

  it("multiple spends and rank organization", async function () {

    //donate
    let addDonator = await top3Donators.connect(accounts[1]).donate({ value: 2e15 });
    await addDonator.wait();

    addDonator = await top3Donators.connect(accounts[2]).donate({ value: 3e15 });
    await addDonator.wait();

    addDonator = await top3Donators.connect(accounts[3]).donate({ value: 4e15 });
    await addDonator.wait();

    //so we put in 1,2,3 and 4 finney, so the highest one should now be the 4e15 from 
    const currentHighestDonators = await top3Donators.getHighestDonators();

    expect(currentHighestDonators[0][0]).to.equal(accounts[3].address);
    expect(currentHighestDonators[0][1]).to.equal(4e15);

    expect(currentHighestDonators[1][0]).to.equal(accounts[2].address);
    expect(currentHighestDonators[1][1]).to.equal(3e15);

    expect(currentHighestDonators[2][0]).to.equal(accounts[1].address);
    expect(currentHighestDonators[2][1]).to.equal(2e15);


  });


  it("update amount and rank organizing", async function () {

    //donate
    let addDonator = await top3Donators.connect(accounts[1]).donate({ value: 2e15 });
    await addDonator.wait();

    addDonator = await top3Donators.connect(accounts[2]).donate({ value: 3e15 });
    await addDonator.wait();

    addDonator = await top3Donators.connect(accounts[3]).donate({ value: 4e15 });
    await addDonator.wait();

    //so we put in 1,2,3 and 4 finney, so the highest one should now be the 4e15 here, now we update the least one by spending again
    addDonator = await top3Donators.connect(accounts[1]).donate({ value: 3e15 });
    await addDonator.wait();
    //accounts[1] should now have spent 2e15+3e15 = 5e15 which is now at rank0

    const currentHighestDonators = await top3Donators.getHighestDonators();
    console.log("HighestDonatorsRank:\n", currentHighestDonators)
    console.log("rank 0\nwallet: ", currentHighestDonators[0][0]);
    //rank0
    expect(currentHighestDonators[0][0]).to.equal(accounts[1].address);
    expect(currentHighestDonators[0][1]).to.equal(5e15); //2e15 + 3e15

    //rank1
    expect(currentHighestDonators[1][0]).to.equal(accounts[3].address);
    expect(currentHighestDonators[1][1]).to.equal(4e15); //2e15 + 3e15


    //rank2
    expect(currentHighestDonators[2][0]).to.equal(accounts[2].address);
    expect(currentHighestDonators[2][1]).to.equal(3e15); //2e15 + 3e15

  });


  it("update amount and rank organizing multiple times", async function () {

    let addDonator = 0;
    var accountCounter;
    for (accountCounter = 0; accountCounter < 9; ++accountCounter) {
      addDonator = await top3Donators.connect(accounts[accountCounter]).donate({ value: ((accountCounter + 1) * 1e15) });
      await addDonator.wait();
    }
    //now the last one is the one with the most amount spend, so account[10] with 10e15

    var currentHighestDonators = await top3Donators.getHighestDonators();
    //rank0
    expect(currentHighestDonators[0][0]).to.equal(accounts[accountCounter - 1].address);
    expect(currentHighestDonators[1][0]).to.equal(accounts[accountCounter - 2].address);
    expect(currentHighestDonators[2][0]).to.equal(accounts[accountCounter - 3].address);


    //update 3 amounts
    for (accountCounter = 0; accountCounter < 3; ++accountCounter) {
      //donate
      addDonator = await top3Donators.connect(accounts[accountCounter]).donate({
        value: ethers.utils.parseUnits("10", 15)
      }); //account[0].10e15+1e15 from previous, account[1].10e15+2e15 from previous, account[2].10e15+3e15 from previous,
      await addDonator.wait();
    }

    //get new ranks
    currentHighestDonators = await top3Donators.getHighestDonators();

    console.log("HighestDonatorsRank:\n", currentHighestDonators)
    console.log("rank 0\nwallet: ", currentHighestDonators[0][0]);
    //rank0
    expect(currentHighestDonators[0][0]).to.equal(accounts[2].address);
    expect(currentHighestDonators[0][1]).to.equal(ethers.utils.parseUnits("13", 15));
    expect(currentHighestDonators[1][0]).to.equal(accounts[1].address);
    expect(currentHighestDonators[1][1]).to.equal(ethers.utils.parseUnits("12", 15));
    expect(currentHighestDonators[2][0]).to.equal(accounts[0].address);
    expect(currentHighestDonators[2][1]).to.equal(ethers.utils.parseUnits("11", 15));

  });



  it("fire events, check if events are emited", async function () {
    //new one at rank 0
    await expect(top3Donators.connect(accounts[1]).donate({ value: (3 * 1e15) }))
      .to.emit(top3Donators, 'topDonatorsUpdate');

    //new one at rank 1
    await expect(top3Donators.connect(accounts[2]).donate({ value: (2 * 1e15) }))
      .to.emit(top3Donators, 'topDonatorsUpdate');

    //new one at rank 2
    await expect(top3Donators.connect(accounts[3]).donate({ value: (1 * 1e15) }))
      .to.emit(top3Donators, 'topDonatorsUpdate');

    //update on rank 0
    await expect(top3Donators.connect(accounts[2]).donate({ value: (3 * 1e15) }))
      .to.emit(top3Donators, 'topDonatorsUpdate');

    //update on rank 2
    await expect(top3Donators.connect(accounts[4]).donate({ value: (3 * 1e15) }))
      .to.emit(top3Donators, 'topDonatorsUpdate');

  });

  it("donate, organize, bring previous donator on top", async function () {

    await top3Donators.connect(accounts[1]).donate({ value: (2 * 1e15) });
    await top3Donators.connect(accounts[2]).donate({ value: (3 * 1e15) });
    await top3Donators.connect(accounts[3]).donate({ value: (4 * 1e15) });

    //this one will not come on top3 but should be registered
    await top3Donators.connect(accounts[4]).donate({ value: (1 * 1e15) });

    let currentHighestDonators = await top3Donators.getHighestDonators();
    console.log("currentHighestDonators:\n", currentHighestDonators);
    expect(currentHighestDonators[0][0]).to.equal(accounts[3].address);
    expect(currentHighestDonators[1][0]).to.equal(accounts[2].address);
    expect(currentHighestDonators[2][0]).to.equal(accounts[1].address);

    //now bring account[4] to the top number 2 and expect event gets fired
    //await top3Donators.connect(accounts[4]).donate({ value: (2.5 * 1e15) }); //total should be 2.5*e15 now

    await expect(top3Donators.connect(accounts[4]).donate({ value: (2.5 * 1e15) }))
      .to.emit(top3Donators, 'topDonatorsUpdate');


    console.log("account 4 donated in total 3.5e15");

    currentHighestDonators = await top3Donators.getHighestDonators();

    expect(currentHighestDonators[1][0]).to.equal(accounts[4].address);
    expect(currentHighestDonators[1][1]).to.equal(3.5 * 1e15);
    console.log("currentHighestDonators:\n", currentHighestDonators);


  });

});


