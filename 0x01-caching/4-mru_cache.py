#!/usr/bin/env python3
"""Task 4: MRU Caching.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """object that allows storing and
    retrieving items from a dic with a LIFO
    when the limit is reached.
    """
    def __init__(self):
        """Initializes the cache.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """assign value of key to the self.cache_data
            and the item value for the key
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                mru_key, _ = self.cache_data.popitem(False)
                print("DISCARD:", mru_key)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Retrieves item by key.
        """
        if key in self.cache_data and key is not None:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key, None)
