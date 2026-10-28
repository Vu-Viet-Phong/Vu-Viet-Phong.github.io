#!/usr/bin/env python3
"""
Production Smoke Test for VuAnalytics Backend.
Usage:
    python backend/scripts/smoke_test.py [API_BASE_URL]
Example:
    python backend/scripts/smoke_test.py https://vuanalytics-backend.onrender.com
    python backend/scripts/smoke_test.py http://localhost:8000
"""

import sys
import json
import urllib.request
import urllib.error
import time

def run_test(name, url, method="GET", data=None):
    print(f"Testing {name}: {url}...", end=" ", flush=True)
    start = time.time()
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8") if data else None,
            headers={"Content-Type": "application/json", "User-Agent": "VuAnalytics-SmokeTest/4.0"}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            elapsed = (time.time() - start) * 1000
            status = resp.status
            body = json.loads(resp.read().decode("utf-8"))
            if status == 200:
                print(f"PASS ({elapsed:.1f}ms)")
                return True, body
            else:
                print(f"FAIL (Status {status})")
                return False, body
    except urllib.error.HTTPError as e:
        print(f"HTTP ERROR {e.code}: {e.reason}")
        return False, None
    except Exception as e:
        print(f"FAILED: {e}")
        return False, None

def main():
    base_url = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:8000"
    print(f"=== VUANALYTICS BACKEND SMOKE TESTS ===")
    print(f"Target URL: {base_url}\n")
    
    tests = [
        ("Health Check", f"{base_url}/health", "GET", None),
        ("Models Catalog", f"{base_url}/api/models", "GET", None),
        ("Models Live Status", f"{base_url}/api/models/status", "GET", None),
        ("Benchmark Metrics", f"{base_url}/api/benchmarks", "GET", None),
        ("PCA Latent Embeddings", f"{base_url}/api/embeddings/pca", "GET", None),
        ("Recommendation Profiles", f"{base_url}/api/recommendation/profiles", "GET", None),
        ("LightGCN Live Inference", f"{base_url}/api/recommendations", "POST", {"user_id": "usr_00", "model": "LightGCN", "top_k": 5}),
        ("SVD Sample Inference", f"{base_url}/api/recommendations", "POST", {"user_id": "usr_00", "model": "MF", "top_k": 5}),
        ("GraphRAG Simulation", f"{base_url}/api/graphrag/query", "POST", {"query": "Find elegant silk dress"})
    ]
    
    passed = 0
    for name, url, method, data in tests:
        success, _ = run_test(name, url, method, data)
        if success:
            passed += 1
            
    print(f"\nResult: {passed}/{len(tests)} tests passed.")
    if passed == len(tests):
        print("ALL SMOKE TESTS SUCCEEDED.")
        sys.exit(0)
    else:
        print("SOME SMOKE TESTS FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    main()
