# Merkle Airdrop Smart Contract

This project demonstrates how to implement a smart contract for an airdrop that uses a Merkle tree for whitelisting addresses. The goal is to generate a Merkle root from a list of eligible addresses, implement a Solidity contract that verifies claims against this Merkle root, and manage the airdrop process.

## Table of Contents

- [Merkle Airdrop Smart Contract](#merkle-airdrop-smart-contract)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Generating the Merkle Tree](#generating-the-merkle-tree)
  - [Deploying the MerkleAirdrop Contract](#deploying-the-merkleairdrop-contract)
  - [Claiming the Airdrop](#claiming-the-airdrop)
  - [Testing](#testing)
  - [Assumptions and Limitations](#assumptions-and-limitations)

## Overview

This project consists of three main components:

1. **Merkle Tree Generation:** A script (`merkle.js`) to generate a Merkle root from a CSV file containing addresses and their respective token amounts.
2. **Solidity Smart Contract:** A contract (`MerkleAirdrop.sol`) that allows users to claim tokens by providing a valid Merkle proof.
3. **Testing:** A test suite to ensure the correct functionality of the airdrop contract.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [Hardhat](https://hardhat.org/) (for testing and deployment)
- [Solidity](https://docs.soliditylang.org/)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Superior212/Airdrop-merkel-tree
   cd merkle-airdrop
   ```

2. **Install the necessary dependencies:**

   ```bash
   npm install
   ```

3. **Prepare the CSV file:**

   Ensure your CSV file containing addresses and token amounts is structured as follows:

   ```
   address,amount
   0x123...abc,100
   0x456...def,200
   ```

   Save this file as `airdrop.csv` in the project root directory.

## Generating the Merkle Tree

To generate the Merkle tree:

1. **Run the `merkle.js` script:**
   ```bash
   node merkle.js
   ```
   This script reads the `airdrop.csv` file, hashes each entry, constructs a Merkle tree, and outputs the Merkle root. You can find the script in the `scripts/` directory.

## Deploying the MerkleAirdrop Contract

1. **Deploy the contract:**

   Using Hardhat, you can deploy the `MerkleAirdrop.sol` contract with the generated Merkle root. The deployment script can be found in the `scripts/deploy.js` file.

   To deploy:

   ```bash
   npx hardhat run scripts/deploy.js
   ```

## Claiming the Airdrop

To claim tokens:

1. **Generate the Merkle proof:**

   Use the `merkletreejs` library to generate a proof for a specific address. Refer to the `scripts/proofGenerator.js` file for an example of how to generate a proof.

2. **Claiming tokens:**

   Users can interact with the deployed contract's `claim` function using a valid Merkle proof.

## Testing

Testing is crucial to ensure the contract behaves as expected. The test suite includes cases for:

- Deploying the contract with a sample ERC20 token and Merkle root.
- Simulating valid and invalid claims.
- Ensuring correct handling of double claims and invalid proofs.

You can find the test cases in the `test/MerkleAirdrop.test.js` file. To run the tests:

```bash
npx hardhat test
```

## Assumptions and Limitations

- The project assumes a basic understanding of Solidity, Merkle trees, and Hardhat.
- The Merkle tree is generated from a CSV file and assumes that all entries are valid.
- The contract does not include advanced security features like pausable functions or upgradability.
