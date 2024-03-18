from dataclasses import dataclass
from datetime import datetime
from node import LightningNode


@dataclass
class LightningChannel:
    id: str
    short_id: str
    capacity: int
    transaction_id: str
    transaction_vout: int
    closing_transaction_id: str
    closing_reason: str
    updated_at: datetime
    created: datetime
    status: int
    node_left: LightningNode
    node_right: LightningNode
