from dataclasses import dataclass
from datetime import datetime


@dataclass
class LightningNode:
    alias: str
    public_key: str
    base_fee_mtokens: int
    cltv_delta: int
    fee_rate: int
    is_disabled: int
    is_disabled: int
    max_htlc_mtokens: int
    min_htlc_mtokens: int
    updated_at: datetime
