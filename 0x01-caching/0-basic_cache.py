#!/usr/bin/env python3

'''that inherits from BaseCaching and is a caching system:
'''


from base_caching import BaseCaching


class BasicCache(BaseCaching):

    def put(self, key, item):
        if item is not None and key is not None:
            self.cache_data[key] = item

    def get(self, key):
        return self.cache_data.get(key, None)
