const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const {Block} = require('./block');
const {Transaction} = require('./transaction');

class Blockchain{
    constructor (){
        this.chain = [this.createGenesisBlock()]; // initialised array contains genesis block
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() { // Genesis block is the first block in the chain and thus needs to be manually created
        return new Block("01/01/2020", "Genesis block", "0") // genesis block does not have a previous block so previousHash is set to 0
    }

    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);    //we can push the reward transaction before the block has actually been mined because the reward cannot be sent until the block is mined and added to the chain anyway. This allows the miner can receive the award as soon as the block has been added to the chain.
        
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        
        this.previousHash = this.getLatestBlock().hash;
        
        this.chain.push(block);

        this.pendingTransactions = [];  //reset the pending transactions to empty now that they have been added to the chain in the last block.
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address.')
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain.')
        }
        
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;