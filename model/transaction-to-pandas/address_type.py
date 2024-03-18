def address_type(address: str) -> int:
    if address.startswith("1"):
        return 1  # "P2PKH"
    if address.startswith("3"):
        return 2  # "P2SH"
    if address.startswith("bc1q"):
        return 3  # "Bech32"
    if address.startswith("bc1p"):
        return 4  # "P2TR"
    return 0  # Unkonwn
