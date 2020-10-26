const SHA256 = require('crypto-js/sha256') //sha256 is a hashing function in the crypto-js library 
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    
    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){ //checks if the public key you are trying to sign with is actually your public key (and not someone elses).
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;  //checks if the from address is null. If true, teh transaction is valid (for cases where a reward is sent there is no fromAddress)

        if(!this.signature || this.signature.length === 0){ //checks if there is a a signature
            throw new Error('No signature in this transaction.');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');    // get public key from signature
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports.Transaction = Transaction;