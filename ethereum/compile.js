const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

// delete the build folder to have a clean compile version of contracts
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// compile contracts
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

// make sure that the build directory exists
fs.ensureDirSync(buildPath);

// write out each compiled contract to it's own file
Object.keys(output).map(contract => {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        output[contract],
    );
})