const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex'); //public key is used to sign transactions and id a wallet (used by people to id a wallet. Everyone knows everyones public key)
const privateKey = key.getPrivate('hex'); //private key is used to gain access to a wallet (functionality not yet implimented) (used by the owner of the wallet and the system to id and access a wallet. Only the owner and the system know the private key)

console.log('\nPrivate Key:', privateKey);
console.log('\nPublic Key:', publicKey + '\n');