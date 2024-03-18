from channel import LightningChannel
from node import LightningNode
from datetime import datetime


def json_to_channel(json) -> LightningChannel:
    return LightningChannel(
        id=json["id"],
        short_id=json["short_id"],
        capacity=int(json["capacity"]),
        transaction_id=json["transaction_id"],
        transaction_vout=int(json["transaction_vout"]),
        closing_transaction_id=(
            json["closing_transaction_id"] if "closing_transaction_id" in json else ""
        ),
        closing_reason=json["closing_reason"] if "closing_reason" in json else "",
        updated_at=datetime.fromisoformat(json["updated_at"].rstrip("Z")),
        created=datetime.fromisoformat(json["created"].rstrip("Z")),
        status=int(json["status"]),
        node_left=json_to_node(json["node_left"]),
        node_right=json_to_node(json["node_right"]),
    )


def json_to_node(json) -> LightningNode:
    return LightningNode(
        alias=json["alias"],
        public_key=json["public_key"],
        base_fee_mtokens=int(json["base_fee_mtokens"]),
        cltv_delta=int(json["cltv_delta"]),
        fee_rate=int(json["fee_rate"]),
        is_disabled=int(json["is_disabled"]),
        max_htlc_mtokens=int(json["max_htlc_mtokens"]),
        min_htlc_mtokens=int(json["min_htlc_mtokens"]),
        updated_at=datetime.fromisoformat(json["updated_at"].rstrip("Z")),
    )
