const {Blockchain, Transaction} = require('./API/blockchain/blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('3f7a3a98d76f91e9ddfc008e6aba6f6ef8a3b05b4939c1b5d2b908819425ddb1')
const myWalletAddress = myKey.getPublic('hex');


let NateCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey); //the sender of the transaction must sign with their key for validation.
NateCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
NateCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of nathan is ', NateCoin.getBalanceOfAddress(myWalletAddress));

NateCoin.chain[1].transactions[0].toAddress = 'Trump';

console.log('Is chain valid?', NateCoin.isChainValid());