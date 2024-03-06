import logging
import requests
from types import Tuple
from channel import LightningChannel
from json_converter import json_to_channel


class LightningAPI:
    def __init__(self, api_url: str):
        self._api_url = api_url

    def find(self, txids: list[str]) -> Tuple[bool, list[LightningChannel]]:
        """
        The mempool API expects queries in the following form:
        base_url?txId[]=txid&txId[]=txid...

        The query variable will make the second part of the query url
        """
        query = ""
        for txid in txids:
            query += f"txId[]={txid}&"
        query = query[:-1]  # Remove the trailing &

        try:
            resp = requests.get(f"{self._api_url}?{query}")
        except requests.exceptions.HTTPError as err:
            logging.log(level=logging.ERROR, msg=f"HTTP error occurred: {err}")
            return False, None
        except requests.exceptions.RequestException as err:
            logging.log(level=logging.ERROR, msg=f"Req error occurred: {err}")

        return True, self._json_to_lightingchannl(resp.json())

    def _json_to_lightingChannel(self, channels_json) -> list[LightningChannel]:
        channels = []
        for tx in channels_json:
            for input in tx.inputs:
                channels.append(json_to_channel(tx.inputs[input]))
            for output in tx.outputs:
                channels.append(json_to_channel(tx.outputs[output]))
        return channels
