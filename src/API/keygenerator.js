const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex'); //public key is used to sign transactions
const privateKey = key.getPrivate('hex'); //private key is used to id a wallet

console.log('\nPrivate Key:', privateKey);
console.log('\nPublic Key:', publicKey + '\n');