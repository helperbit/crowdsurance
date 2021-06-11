SOLC=/home/dakk/Repositories/Ethereum/solidity/build/solc/solc 
SOURCE=insurbit.sol
DEST=-o bin


all:
	$(SOLC) $(SOURCE) --ast $(DEST)
	$(SOLC) $(SOURCE) --ast-json $(DEST)
	$(SOLC) $(SOURCE) --asm $(DEST)
	$(SOLC) $(SOURCE) --asm-json $(DEST)
	$(SOLC) $(SOURCE) --bin $(DEST)
	$(SOLC) $(SOURCE) --abi $(DEST)
	$(SOLC) $(SOURCE) --hashes $(DEST)


deploy-testnet:


