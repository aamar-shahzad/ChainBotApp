from dataclasses import dataclass


@dataclass
class transaction:
    txid: str
    hash: str
    version: int
    size: int
    vsize: int
    weight: int
    locktime: int
    hex: str
    blockhash: str
    confirmations: int
    time: int
    blocktime: int
