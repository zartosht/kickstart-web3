# Web3 Kickstart project

I created this project while learning web3 with this [Udemy course](https://www.udemy.com/share/101rjU3@oLYMhtAXpufYyulbb8C11K8PUiscrdXuOr5Nf_NPSekIlg0jw2iLf0SlNnoWvzbFdA==/).

This project solves the simple problem of trusting people 😄.
Here anybody can create a campaign about her idea, and then people can donate to this campaign. Then the creator can make requests containing a description and a recipient address, which must be approved by at least half of the contributors. After the appropriate contributors approve the request, the idea manager can transfer the requested value to the recipient.

Here I learned how to create a contract that can deploy other contracts and How to write excellent function modifiers and some other cool stuff.

## Folder structure

* ethereum

This folder contains all Ethereum-related files like contracts, `compile.js`,  and `deploy.js`.

* ethereum/build

This folder will be populated with the compiled version of our Solidity contract after you run [`npm run compile`](#npm-run-compile).

* ethereum/contracts

This folder contains latest version of our contracts.

* test

This folder contains all tests related to this application, both front-end, and Ethereum.

## Commands

These commands should run one after the other the first time.

### npm run compile

This command will refresh the contents of the `ethereum/build` folder with the newly compiled contracts inside `ethereum/contracts`.

### npm run deploy

This command will deploy the factory contract to the requested network.

> Before running this command, copy `.env.example` and name it `.env`. Fill `ACCOUNT_MNEMONIC` and `NETWORK_URL` (from [Infura](https://www.infura.io/)). This command will output something like this:

```bash
npm run deploy

> kickstart@1.0.0 deploy
> node ethereum/deploy.js

Attempting to deploy from account 0xfb42EF61F958b95F6D5657E9553eE989dca94eb4
Contract deployed to 0xFdb3e9e1801e7ef37D6c18234E988b8f8137428A
```

Copy the address in front of `Contract deployed to ...` and populate the third environmental value in that `.env` file you created in the last step. 

### npm run test

This command will test contracts against the local ganache test Ethereum network.

> You can run `npm run test -- -verbose` to get more detailed output from `ganache`.