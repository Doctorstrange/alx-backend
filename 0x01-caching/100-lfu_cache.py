#!/usr/bin/env python3
"""Task 5: Least Frequently Used caching module.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """object that allows storing and
    retrieving items from a dic with a LIFO
    when the limit is reached.
    """
    def __init__(self):
        """Initializes the cache.
        """
        super().__init__()
        self.cache_data = OrderedDict()
        self.keys_freq = []

    def __reorder_items(self, mru_key):
        """Reorders the items in this cache based on the most
        recently used item.
        """
        max_positions = []
        count = 0
        freq = 0
        position = 0

        for i, (key, freq) in enumerate(self.keys_freq):
            if key == mru_key:
                count = freq + 1
                freq = i
                break
            elif (not max_positions or
                    freq < self.keys_freq[max_positions[-1]][1]):
                max_positions.append(i)

        max_positions.reverse()

        for pos in max_positions:
            if self.keys_freq[pos][1] > count:
                break
            position = pos

        del self.keys_freq[freq]
        self.keys_freq.insert(position, (mru_key, count))

    def put(self, key, item):
        """assign value of key to the self.cache_data
            and the item value for the key
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                lfu_key, _ = self.keys_freq[-1]
                self.cache_data.pop(lfu_key)
                self.keys_freq.pop()
                print("DISCARD:", lfu_key)
            self.cache_data[key] = item
            ins_index = len(self.keys_freq)
            for i, key_freq in enumerate(self.keys_freq):
                if key_freq[1] == 0:
                    ins_index = i
                    break
            self.keys_freq.insert(ins_index, [key, 0])
        else:
            self.cache_data[key] = item
            self.__reorder_items(key)

    def get(self, key):
        """Retrieves item by key.
        """
        if key is not None and key in self.cache_data:
            self.__reorder_items(key)
        return self.cache_data.get(key, None)
