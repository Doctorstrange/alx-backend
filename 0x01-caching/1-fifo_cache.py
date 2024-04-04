#!/usr/bin/env python3

'''that inherits from BaseCaching and is a caching system:
'''


from collections import OrderedDict
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """class that inherits from Basecache"""

    def __init__(self):
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """assign value of key to the self.cache_data"""

        if key is None or item is None:
            return

        if BaseCaching.MAX_ITEMS < len(self.cache_data):
            first_key, _ = self.cache_data.popitem(last=False)
            print(f"DISCARD: {first_key}")

        self.cache_data[key] = item

    def get(self, key):
        """return self.cache data linked to key value"""
        return self.cache_data.get(key, None)
