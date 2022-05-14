# Top3Donators

contract holds the addresses of the top3 donators and updates the ranks.



## use case
- get current highest 3 donators

## examples
Used at a nft mint contract to observe the top3 donators and later on reward them with special nfts.


## properties/specialities
- New donations from existing wallets will lead to a summed up amount of these.
- If a new donation or a donation update comes the rank of the top3 donators will be checked and reordered

## Prerequisites
<ul  dir="auto">
<li><a  href="https://nodejs.org/en/download/"  rel="nofollow">Nodejs and npm</a>
You'll know you've installed nodejs right if you can run:


```
node --version
```
 and get an ouput like: <code>vx.x.x</code>
</ul>
<ul  dir="auto">
<li><a  href="https://hardhat.org/getting-started/"  rel="nofollow">hardhat</a>
You'll know you've installed hardhat right if you can run:

```
npx hardhat --version
```
and get an ouput like: <code>2.9.3</code>
</ul>
<ul  dir="auto">
A webbrowser, since you can read this here I should not have to  mention it^^
</ul>
<ul  dir="auto">
Basic understand of js, hardhat and solidity. If you want to get basic understanding up to expert I highly recommend
the man, the myth, the legend: <a href="https://www.youtube.com/watch?v=M576WGiDBdQ&t=10s">Patrick Collins</a>
</ul>
<ul  dir="auto">
Some rinkeby eth if you deploying to rinkeby testnet, you could grap some <a href="https://faucets.chain.link/rinkeby">here</a>
</ul>



## dependencies
install dependencies: 
```
npm install --save-dev @openzeppelin/contracts @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai dotenv
```


## For the fast runners
## clone repository
fire up the git clone command: 
```
git clone https://github.com/MichiMich/Top3Donators
```

## cd into it
```
cd Top3Donators
```

## and deploy/mint it:
a) to local hardhat: 
```
npx hardhat run scripts/deploy.js
```

b) rinkeby: 
**never share your private keys with anyone! I highly recommend you to create a new wallet only for testing contracts, dont use your wallets with actual money on it!! Please friend be save, better save than sorry! If you want to push your data on github, add the <code>.env</code> at the .gitignore file**

I used 1 wallet for the deploy script, so you can add the private key at .env.

fill in your <a href="https://www.alchemy.com/">alchemy url</a> at the .env file at <code>URL_RINKEBY</code> and deploy it on rinkeby with 
```
npx hardhat run scripts/deploy.js --network rinkeby
```
