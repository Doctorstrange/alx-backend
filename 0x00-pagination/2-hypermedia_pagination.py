#!/usr/bin/env python3
"""opy index_range from the previous task and the
following class into your code
"""

import csv
import math
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Return a tuple of size two containing a start index and an end index
    """

    return ((page - 1) * page_size, ((page - 1) * page_size) + page_size)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """get page of data
        """
        assert type(page) == int and type(page_size) == int
        assert page > 0 and page_size > 0
        start, end = index_range(page, page_size)
        save = self.dataset()
        if start > len(save):
            return []
        return save[start:end]

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """takes the same arguments (and defaults) as
        get_page and returns a dictionary
        """
        save = self.indexed_dataset()
        assert index is not None and index >= 0 and index <= max(save.keys())
        page_save = []
        next_index = None
        count = 0
        start = index if index else 0
        for i, item in save.items():
            if i >= start and count < page_size:
                page_save.append(item)
                count += 1
                continue
            if count == page_size:
                next_index = i
                break
        parameter = {
            'index': index,
            'next_index': next_index,
            'page_size': len(page_save),
            'data': page_save,
        }
        return parameter
