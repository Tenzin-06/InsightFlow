def chunk_items(items: list, size: int) -> list[list]:
    if size <= 0:
        return [items]
    return [items[index : index + size] for index in range(0, len(items), size)]

