from bitcoinrpc.authproxy import AuthServiceProxy


class BitcoinClient:
    def __init__(self, host="127.0.0.1", username="admin", password="admin"):
        self.rpc = AuthServiceProxy(
            f"http://{username}:{password}@{host}:8332", timeout=120
        )

    def transaction_by_id(self, txid):
        return self.rpc.getrawtransaction(txid, True)

    def blockcount(self):
        return self.rpc.getblockcount()

    def getblock(self, blockhash):
        return self.rpc.getblock(blockhash, 1)

    def blockhash_by_height(self, height):
        return self.rpc.getblockhash(height)

    def blocks(self, rng):
        """Returns a list of block hashes starting from the current block
        and going back in time by the range specified"""
        blockcount = self.blockcount()
        return [self.blockhash_by_height(blockcount - i) for i in range(rng)]

    def block_range(self, start, finish):
        return [self.blockhash_by_height(i) for i in range(start, finish + 1)]
