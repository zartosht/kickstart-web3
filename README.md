# Web3 Kickstart project

I created this project while learning web3 with this [Udemy course](https://www.udemy.com/share/101rjU3@oLYMhtAXpufYyulbb8C11K8PUiscrdXuOr5Nf_NPSekIlg0jw2iLf0SlNnoWvzbFdA==/).

This project solves the simple problem of trusting people 😄.
Here anybody can create a campaign about her idea, and then people can donate to this campaign. Then the creator can make requests containing a description and a recipient address, which must be approved by at least half of the contributors. After the appropriate contributors approve the request, the idea manager can transfer the requested value to the recipient.

Here I learned how to create a contract that can deploy other contracts and How to write excellent function modifiers and some other cool stuff.

## Folder structure

* Ethereum

This folder contains all Ethereum-related files like contracts, `compile.js`,  and `deploy.js`.

## Commands

### npm run compile

This command will refresh the contents of the `ethereum/build` folder with the newly compiled contracts inside `ethereum/contracts`.

### npm run test

This command will test contracts against the local ganache test Ethereum network.

> You can run `npm run test -- -verbose` to get more detailed output from `ganache`.