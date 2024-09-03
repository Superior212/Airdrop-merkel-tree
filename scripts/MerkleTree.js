const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const csv = require("csv-parser");

async function main() {
    const values = [];
    const proofs = {};  // Object to store proofs

    fs.createReadStream("scripts/airdrop.csv")
        .pipe(csv())
        .on("data", (row) => {
            values.push([row.address, row.amount]);
        })
        .on("end", () => {
            const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
            console.log("Merkle Root:", tree.root);

            // Generate Merkle proofs for all addresses and store in proofs object
            for (const [i, v] of tree.entries()) {
                const proof = tree.getProof(i);
                proofs[v[0]] = {
                    amount: v[1],
                    proof: proof
                };
                console.log(`Address: ${v[0]}`);
                console.log('Proof:', proof);
                console.log('----------------------');
            }

            // Save the Merkle tree and proofs to JSON files in the scripts folder
            fs.writeFileSync('scripts/merkleTree.json', JSON.stringify(tree.dump(), null, 2));
            fs.writeFileSync('scripts/proofs.json', JSON.stringify(proofs, null, 2));

            console.log('Merkle tree and proofs saved to scripts/merkleTree.json and scripts/proofs.json');
        })
        .on("error", (err) => {
            console.error("Error reading 'airdrop.csv':", err);
        });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
