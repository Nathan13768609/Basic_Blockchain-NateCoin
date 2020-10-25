const {Blockchain, Transaction} = require('./blockchain');

let NateCoin = new Blockchain();
NateCoin.createTransaction(new Transaction('address1', 'address2', 100))
NateCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\n Starting the miner...');
NateCoin.minePendingTransactions('nathans-address');

console.log('\nBalance of nathan is ', NateCoin.getBalanceOfAddress('nathans-address'));


console.log('\n Starting the miner again...');
NateCoin.minePendingTransactions('nathans-address');

console.log('\nBalance of nathan is ', NateCoin.getBalanceOfAddress('nathans-address'));