#!/usr/bin/env python3

'''that inherits from BaseCaching and is a caching system:
'''


from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """class that inherits from Basecache"""

    def put(self, key, item):
        """assign value of key to the self.cache_data"""
        if item is not None and key is not None:
            self.cache_data[key] = item

    def get(self, key):
        """return self.cache data"""
        return self.cache_data.get(key, None)
