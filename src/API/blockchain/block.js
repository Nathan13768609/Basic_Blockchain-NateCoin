const SHA256 = require('crypto-js/sha256') //sha256 is a hashing function in the crypto-js library 

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //used so that a different hash cna be calculated when mining.
    }

    calculateHash(){
        return SHA256(this.previouseHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString(); //return a String instead of an Object
    }

    mineBlock(difficulty){
        console.log('Mining new block...')

        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++; //ensures a new hash will be calculated
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

module.exports.Block = Block;