# Basic_Blockchain-NateCoin
**Goal**: Build a crypto currency trading platform.

**Objectives:**
* Develop blockchain API
  * Impliment mining with proof of work
  * Impliment mining rewards
  * Validate transactions
* Sign-up (create new Wallet)
* Log-in (Access a Wallet)
* Validate Wallets
* Securly send NateCoins from your Wallet to another Wallet
* Receive NateCoins in your wallet sent from another Wallet
* Mine NateCoins
* View Wallet history
* Impliment peer to peer network

## Features
### - Proof of Work
Proof of work is applied to block mining by requiring a hash to start with a predefined number of zeros (difficulty). 

The nonce variable is continuously incrimented until a hash is found that starts with the required number of zeros. This is the only purpose of teh nocne variable, it has no relation to the other data inside the block.
    
    mineBlock(difficulty){
      console.log('Mining new block...')

      while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){  //checks the starting digits against the required number of starting zeros.
        this.nonce++; //ensures a new hash will be calculated
        this.hash = this.calculateHash();
      }

      console.log("Block mined: " + this.hash);
    }
  
### - Rewards
Miners are given a reward for successfully mining a block. This encourages users to mine new blocks to be added to the chain, creating a self sustainable system.

### - Transactions
New transactions are temporarily stored in a pendingTransactions array and then added to a block which is then mined. Once the block has been successfully mined the pendingTransactions array is cleared.

There is a limitation here. If a user adds a new transaction while a block is already being mined, that new transaction wont be added to the block being mined, and when the pendingTransactions array is cleared that new transaction will be deleted without being added to the chain. Future versions will seek to correct this issue.

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

### - Signing Transactions
A transaction has the following attributes {fromAddress, toAddress, amount, signature}

In order to validate a transaction, it must be signed by the sender (fromAddress). This is done using a key generator library (https://www.npmjs.com/package/elliptic).

For a transaction to be added to the pendingTransactions array, it must first be validated. This validation is done using the verify fucntion of the key object.

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
    
