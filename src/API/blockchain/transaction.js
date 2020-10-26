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

        // once accounts are set up - Check private key against accounts in database to verify the key (wallet) actually exists. 

        if(signingKey.getPublic('hex') !== this.fromAddress){ //checks if the public key you are trying to sign with is actually your public key (and not someone elses).
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64'); // signingKey now stores that it has signed hashTx
        this.signature = sig.toDER('hex');  // formatting  
    }

    isValid(){
        if(this.fromAddress === null) return true;  //checks if the from address is null. If true, the transaction is valid (for cases where a reward is sent there is no fromAddress)

        if(!this.signature || this.signature.length === 0){ //checks if there is a a signature
            throw new Error('No signature in this transaction.');
        }

        const key = ec.keyFromPublic(this.fromAddress, 'hex');    // get key (pub and priv) object from public key.
        return key.verify(this.calculateHash(), this.signature);    // checks this.signature for the calculatedHash which should be the same as hashTx in signTransaction(). If it is not the same then the transaction has been corrupted.
    }
}

module.exports.Transaction = Transaction;