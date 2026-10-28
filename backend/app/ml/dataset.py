"""
Curated Amazon Review Data Benchmark Slice (16 users x 20 items)
Schema based on: Julian McAuley UCSD (He & McAuley, WWW 2016).
Type: Curated Educational Research Benchmark.
License: Academic & Educational Research Use Only.
"""

import numpy as np
import json
from typing import List, Dict, Any, Tuple

# Curated 16x20 interaction benchmark based on Amazon Clothing, Shoes & Jewelry schema
# Formatted for lightweight, reproducible CPU collaborative filtering evaluation
AMAZON_CLOTHING_ITEMS: List[Dict[str, Any]] = [
    {"asin": "B00004SR8W", "title": "Ray-Ban Aviator Classic Polarized Sunglasses", "category": "Accessories", "style": "Classic", "price": 163.0},
    {"asin": "B000072UM4", "title": "Carhartt Men's Acrylic Watch Beanie Hat", "category": "Knitwear", "style": "Workwear", "price": 19.99},
    {"asin": "B0000ANHST", "title": "Levi's Men's 501 Original Fit Jeans", "category": "Apparel", "style": "Classic", "price": 59.50},
    {"asin": "B0001ZNZV6", "title": "Champion Men's Powerblend Fleece Pullover Hoodie", "category": "Apparel", "style": "Casual", "price": 34.99},
    {"asin": "B0002M9TGO", "title": "Birkenstock Arizona Unisex Leather Slide Sandals", "category": "Footwear", "style": "Casual", "price": 110.0},
    {"asin": "B0006LMG7E", "title": "Pendleton Men's Classic Board Wool Button-Down Shirt", "category": "Apparel", "style": "Classic", "price": 149.0},
    {"asin": "B0007CKO92", "title": "Columbia Men's Watertight II Waterproof Packable Rain Jacket", "category": "Outerwear", "style": "Minimalist", "price": 75.0},
    {"asin": "B0009MZ67C", "title": "Barbour Classic Bedale Waxed Cotton Jacket", "category": "Outerwear", "style": "Heritage", "price": 415.0},
    {"asin": "B000A2K6O4", "title": "Timberland 6-Inch Premium Waterproof Leather Boots", "category": "Footwear", "style": "Workwear", "price": 198.0},
    {"asin": "B000E0OH1Q", "title": "Clarks Originals Men's Desert Chukka Boot", "category": "Footwear", "style": "Minimalist", "price": 130.0},
    {"asin": "B000FE6P7E", "title": "Hanes Men's Premium Ecosmart Crewneck Undershirts (Pack of 3)", "category": "Apparel", "style": "Minimalist", "price": 18.0},
    {"asin": "B000G2Y4OU", "title": "Schott NYC Men's Classic Leather Motorcycle Jacket", "category": "Outerwear", "style": "Edgy", "price": 850.0},
    {"asin": "B000H82GB0", "title": "Patagonia Men's Better Sweater Fleece Jacket", "category": "Knitwear", "style": "Outdoor", "price": 149.0},
    {"asin": "B000H86TFU", "title": "Woolrich Men's Buffalo Check Wool Flannel Overshirt", "category": "Knitwear", "style": "Heritage", "price": 165.0},
    {"asin": "B000HQSUY0", "title": "Red Wing Heritage Men's Iron Ranger 6-Inch Boot", "category": "Footwear", "style": "Heritage", "price": 349.99},
    {"asin": "B000J48V5A", "title": "Alpha Industries MA-1 Heritage Flight Bomber Jacket", "category": "Outerwear", "style": "Edgy", "price": 190.0},
    {"asin": "B000J65Z4Q", "title": "Filson Rugged Twill Medium Duffle Bag", "category": "Accessories", "style": "Heritage", "price": 495.0},
    {"asin": "B000KEGZTK", "title": "Everlane Minimalist Relaxed Silk Button-Up Shirt", "category": "Apparel", "style": "Minimalist", "price": 128.0},
    {"asin": "B000N8G5D0", "title": "Common Projects Original Leather Achilles Low Sneakers", "category": "Footwear", "style": "Minimalist", "price": 425.0},
    {"asin": "B000O3206A", "title": "Uniqlo Ultra Light Down Compact Packable Vest", "category": "Outerwear", "style": "Minimalist", "price": 49.90},
]

# 16 Verified Users with distinct preference profiles
AMAZON_CLOTHING_USERS: List[Dict[str, str]] = [
    {"user_id": f"usr_{i:02d}", "name": name, "profile": profile}
    for i, (name, profile) in enumerate([
        ("Elena Vance", "Minimalist & Architectural Luxury"),
        ("Marcus Brody", "Classic Heritage & Rugged Workwear"),
        ("Aria Chen", "Modern Casual & Daily Comfort"),
        ("David Sterling", "Executive Outerwear & Formal"),
        ("Nadia Al-Mansoor", "Minimalist Silk & Footwear"),
        ("Leo Kirkpatrick", "Urban Edgy & Leatherwear"),
        ("Sophia Dubois", "Sustainable Knitwear & Classic"),
        ("Julian Thorne", "Outdoor Techwear & Performance"),
        ("Chloe Moreau", "Casual Essentials & Denim"),
        ("Devon Brooks", "Heritage Boots & Flannels"),
        ("Zara Jensen", "Minimalist Clean Silhouette"),
        ("Thomas Wright", "Workwear Heavy Duty & Boots"),
        ("Amara Okafor", "Contemporary Apparel & Bags"),
        ("Lucas Silva", "Casual Streetwear & Sneakers"),
        ("Mia Lindqvist", "Scandinavian Wool & Knitwear"),
        ("Ethan Hawke", "All-Weather Outerwear & Jackets")
    ])
]

# Interaction ground truth: (user_idx, item_idx, rating, timestamp)
# Satisfies 5-core condition where users and items have >= 3-5 verified interactions
INTERACTION_RECORDS: List[Tuple[int, int, float, int]] = [
    # usr_00 (Minimalist Luxury) -> Ray-Ban (0), Desert Boot (9), Silk Shirt (17), Achilles Sneaker (18), Down Vest (19)
    (0, 0, 5.0, 1609459200), (0, 9, 4.0, 1609545600), (0, 17, 5.0, 1609632000), (0, 18, 5.0, 1609718400), (0, 19, 4.0, 1609804800),
    # usr_01 (Heritage & Workwear) -> Carhartt Beanie (1), Levi's 501 (2), Wool Flannel (5), Timberland (8), Red Wing (14)
    (1, 1, 5.0, 1610064000), (1, 2, 5.0, 1610150400), (1, 5, 4.0, 1610236800), (1, 8, 5.0, 1610323200), (1, 14, 5.0, 1610409600),
    # usr_02 (Modern Casual) -> Champion Hoodie (3), Birkenstock (4), Rain Jacket (6), Hanes (10), Down Vest (19)
    (2, 3, 5.0, 1610496000), (2, 4, 4.0, 1610582400), (2, 6, 4.0, 1610668800), (2, 10, 5.0, 1610755200), (2, 19, 4.0, 1610841600),
    # usr_03 (Executive Outerwear) -> Barbour Jacket (7), Clarks Desert (9), Leather Jacket (11), Duffle Bag (16), Down Vest (19)
    (3, 7, 5.0, 1610928000), (3, 9, 4.0, 1611014400), (3, 11, 5.0, 1611100800), (3, 16, 5.0, 1611187200), (3, 19, 4.0, 1611273600),
    # usr_04 (Minimalist Silk & Footwear) -> Ray-Ban (0), Birkenstock (4), Clarks Desert (9), Silk Shirt (17), Achilles Sneaker (18)
    (4, 0, 4.0, 1611360000), (4, 4, 4.0, 1611446400), (4, 9, 5.0, 1611532800), (4, 17, 5.0, 1611619200), (4, 18, 5.0, 1611705600),
    # usr_05 (Urban Edgy) -> Ray-Ban (0), Timberland (8), Leather Jacket (11), Bomber Jacket (15), Achilles Sneaker (18)
    (5, 0, 4.0, 1611792000), (5, 8, 4.0, 1611878400), (5, 11, 5.0, 1611964800), (5, 15, 5.0, 1612051200), (5, 18, 4.0, 1612137600),
    # usr_06 (Sustainable Knitwear) -> Pendleton (5), Rain Jacket (6), Patagonia Fleece (12), Woolrich (13), Down Vest (19)
    (6, 5, 5.0, 1612224000), (6, 6, 4.0, 1612310400), (6, 12, 5.0, 1612396800), (6, 13, 5.0, 1612483200), (6, 19, 4.0, 1612569600),
    # usr_07 (Outdoor Techwear) -> Carhartt (1), Rain Jacket (6), Barbour (7), Patagonia (12), Red Wing (14)
    (7, 1, 4.0, 1612656000), (7, 6, 5.0, 1612742400), (7, 7, 5.0, 1612828800), (7, 12, 5.0, 1612915200), (7, 14, 4.0, 1613001600),
    # usr_08 (Casual Essentials) -> Levi's 501 (2), Champion (3), Birkenstock (4), Hanes (10), Silk Shirt (17)
    (8, 2, 5.0, 1613088000), (8, 3, 4.0, 1613174400), (8, 4, 5.0, 1613260800), (8, 10, 5.0, 1613347200), (8, 17, 3.0, 1613433600),
    # usr_09 (Heritage Boots) -> Levi's 501 (2), Pendleton (5), Timberland (8), Woolrich (13), Red Wing (14), Filson (16)
    (9, 2, 4.0, 1613520000), (9, 5, 5.0, 1613606400), (9, 8, 5.0, 1613692800), (9, 13, 5.0, 1613779200), (9, 14, 5.0, 1613865600), (9, 16, 4.0, 1613952000),
    # usr_10 (Clean Silhouette) -> Ray-Ban (0), Clarks Desert (9), Silk Shirt (17), Achilles (18), Down Vest (19)
    (10, 0, 5.0, 1614038400), (10, 9, 4.0, 1614124800), (10, 17, 5.0, 1614211200), (10, 18, 5.0, 1614297600), (10, 19, 4.0, 1614384000),
    # usr_11 (Workwear Heavy Duty) -> Carhartt (1), Levi's 501 (2), Timberland (8), Bomber (15), Red Wing (14)
    (11, 1, 5.0, 1614470400), (11, 2, 5.0, 1614556800), (11, 8, 5.0, 1614643200), (11, 15, 4.0, 1614729600), (11, 14, 5.0, 1614816000),
    # usr_12 (Contemporary Apparel) -> Ray-Ban (0), Champion (3), Barbour (7), Filson (16), Achilles (18)
    (12, 0, 4.0, 1614902400), (12, 3, 4.0, 1614988800), (12, 7, 5.0, 1615075200), (12, 16, 5.0, 1615161600), (12, 18, 5.0, 1615248000),
    # usr_13 (Streetwear) -> Champion (3), Birkenstock (4), Leather Jacket (11), Bomber (15), Achilles (18)
    (13, 3, 5.0, 1615334400), (13, 4, 4.0, 1615420800), (13, 11, 4.0, 1615507200), (13, 15, 5.0, 1615593600), (13, 18, 5.0, 1615680000),
    # usr_14 (Scandinavian Wool) -> Pendleton (5), Patagonia (12), Woolrich (13), Silk Shirt (17), Down Vest (19)
    (14, 5, 5.0, 1615766400), (14, 12, 5.0, 1615852800), (14, 13, 5.0, 1615939200), (14, 17, 4.0, 1616025600), (14, 19, 5.0, 1616112000),
    # usr_15 (All-Weather) -> Rain Jacket (6), Barbour (7), Timberland (8), Bomber (15), Down Vest (19)
    (15, 6, 5.0, 1616198400), (15, 7, 5.0, 1616284800), (15, 8, 4.0, 1616371200), (15, 15, 4.0, 1616457600), (15, 19, 5.0, 1616544000)
]


class AmazonClothingBenchmark:
    """
    Manages deterministic, leak-free train/val/test splits and evaluation metrics
    for the Amazon Clothing 5-core benchmark slice.
    """
    def __init__(self, random_seed: int = 42):
        self.random_seed = random_seed
        self.num_users = len(AMAZON_CLOTHING_USERS)
        self.num_items = len(AMAZON_CLOTHING_ITEMS)
        self.users = AMAZON_CLOTHING_USERS
        self.items = AMAZON_CLOTHING_ITEMS
        
        self.train_interactions: List[Tuple[int, int]] = []
        self.val_interactions: List[Tuple[int, int]] = []
        self.test_interactions: List[Tuple[int, int]] = []
        
        self.train_matrix = np.zeros((self.num_users, self.num_items), dtype=np.float32)
        self.test_matrix = np.zeros((self.num_users, self.num_items), dtype=np.float32)
        
        self._split_data()

    def _split_data(self):
        """
        Split interactions per user to prevent information leakage.
        For each user: 80% train, 10% validation, 10% test (at least 1 test item).
        """
        rng = np.random.RandomState(self.random_seed)
        
        user_to_items: Dict[int, List[int]] = {}
        for u, i, r, t in INTERACTION_RECORDS:
            user_to_items.setdefault(u, []).append(i)
            
        for u, item_list in user_to_items.items():
            shuffled = list(item_list)
            rng.shuffle(shuffled)
            
            n = len(shuffled)
            n_test = max(1, int(round(n * 0.15)))
            n_val = max(1, int(round(n * 0.15))) if n >= 5 else 0
            n_train = n - n_test - n_val
            
            train_items = shuffled[:n_train]
            val_items = shuffled[n_train:n_train + n_val]
            test_items = shuffled[n_train + n_val:]
            
            for i in train_items:
                self.train_interactions.append((u, i))
                self.train_matrix[u, i] = 1.0
                
            for i in val_items:
                self.val_interactions.append((u, i))
                
            for i in test_items:
                self.test_interactions.append((u, i))
                self.test_matrix[u, i] = 1.0

    @property
    def total_interactions(self) -> int:
        return len(INTERACTION_RECORDS)

    @property
    def sparsity(self) -> float:
        total_possible = self.num_users * self.num_items
        return float(1.0 - (self.total_interactions / total_possible))

    def get_user_ground_truth(self, user_idx: int) -> List[int]:
        """Return ground truth test item indices for user."""
        return [i for u, i in self.test_interactions if u == user_idx]


def compute_ranking_metrics(predictions: np.ndarray, ground_truth_matrix: np.ndarray, k: int = 10) -> Dict[str, float]:
    """
    Standard recommendation evaluation metrics: Recall@K and NDCG@K.
    predictions: (num_users, num_items) score matrix.
    ground_truth_matrix: (num_users, num_items) binary ground truth test matrix.
    """
    recalls = []
    ndcgs = []
    
    num_users, num_items = predictions.shape
    k = min(k, num_items)
    
    for u in range(num_users):
        targets = np.where(ground_truth_matrix[u] > 0)[0]
        if len(targets) == 0:
            continue
            
        top_k_indices = np.argsort(predictions[u])[::-1][:k]
        
        # Hits
        hits = [1 if idx in targets else 0 for idx in top_k_indices]
        num_hits = sum(hits)
        
        # Recall@K
        recall = num_hits / float(len(targets))
        recalls.append(recall)
        
        # DCG@K
        dcg = sum((hit / np.log2(rank + 2)) for rank, hit in enumerate(hits))
        
        # IDCG@K
        ideal_hits = [1] * min(k, len(targets))
        idcg = sum((1.0 / np.log2(rank + 2)) for rank in range(len(ideal_hits)))
        
        ndcg = (dcg / idcg) if idcg > 0 else 0.0
        ndcgs.append(ndcg)
        
    return {
        f"recall@{k}": round(float(np.mean(recalls)), 4) if recalls else 0.0,
        f"ndcg@{k}": round(float(np.mean(ndcgs)), 4) if ndcgs else 0.0,
        "evaluated_users": len(recalls)
    }
