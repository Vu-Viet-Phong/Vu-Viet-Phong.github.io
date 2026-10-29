#!/usr/bin/env python3
"""
Comprehensive Production & Staging Smoke Test Suite for VuAnalytics Backend.
Usage:
    python backend/scripts/smoke_test.py [API_BASE_URL]
Example:
    python backend/scripts/smoke_test.py http://localhost:8000
    python backend/scripts/smoke_test.py https://vuanalytics-backend.onrender.com
"""

import sys
import json
import time
import urllib.request
import urllib.error

def run_http(url, method="GET", data=None, headers=None, timeout=20):
    default_headers = {
        "Content-Type": "application/json",
        "User-Agent": "VuAnalytics-SmokeTest/4.0",
        "Origin": "https://vuanalytics.me"
    }
    if headers:
        default_headers.update(headers)

    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8") if data else None,
        headers=default_headers,
        method=method
    )
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            elapsed = (time.time() - start) * 1000
            status = resp.status
            resp_headers = dict(resp.info())
            body_bytes = resp.read()
            body = json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
            return True, status, elapsed, resp_headers, body
    except urllib.error.HTTPError as e:
        elapsed = (time.time() - start) * 1000
        body_bytes = e.read()
        try:
            body = json.loads(body_bytes.decode("utf-8"))
        except Exception:
            body = body_bytes.decode("utf-8", errors="ignore")
        return False, e.code, elapsed, dict(e.headers), body
    except Exception as e:
        elapsed = (time.time() - start) * 1000
        return False, 0, elapsed, {}, str(e)


def main():
    base_url = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:8000"
    print("=" * 65)
    print(f"VUANALYTICS 4.0 — STAGING & BACKEND INTEGRATION TEST SUITE")
    print(f"Target URL: {base_url}")
    print("=" * 65 + "\n")

    test_results = []

    def check(name, success, detail=""):
        status_str = "PASS" if success else "FAIL"
        print(f"[{status_str}] {name:<45} {detail}")
        test_results.append((name, success))
        return success

    # 1. Health Check
    ok, code, lat, hdrs, body = run_http(f"{base_url}/health")
    check("1. Health Endpoint (/health)", ok and code == 200 and body.get("status") == "ok", f"({lat:.1f}ms, version={body.get('version')})")

    # 2. X-API-Version & X-Process-Time Headers
    has_ver = "x-api-version" in hdrs or "X-API-Version" in hdrs
    has_time = "x-process-time" in hdrs or "X-Process-Time" in hdrs
    check("2. Latency & Version Headers", has_ver and has_time, f"(API={hdrs.get('x-api-version', '4.0.0')})")

    # 3. CORS Preflight & Origin Header Check
    cors_origin = hdrs.get("access-control-allow-origin", "")
    check("3. CORS Allow-Origin (https://vuanalytics.me)", cors_origin == "https://vuanalytics.me" or cors_origin == "*", f"(Origin={cors_origin})")

    # 4. Models Catalog
    ok, code, lat, hdrs, body = run_http(f"{base_url}/api/models")
    has_models = ok and "models" in body and "LightGCN" in body["models"]
    check("4. Models Catalog (/api/models)", has_models, f"({lat:.1f}ms, models={len(body.get('models', []))})")

    # 5. Models Live Status & Checkpoint State
    ok, code, lat, hdrs, body = run_http(f"{base_url}/api/models/status")
    l_loaded = body.get("models", {}).get("LightGCN", {}).get("checkpoint_loaded", False)
    check("5. Checkpoint Loaded Status", ok and l_loaded, f"(LightGCN loaded={l_loaded})")

    # 6. Segregated Benchmark Verification
    ok, code, lat, hdrs, body = run_http(f"{base_url}/api/benchmarks")
    has_empirical = "empirical_models" in body and "theoretical_simulations" in body
    check("6. Segregated Benchmark Tables", ok and has_empirical, f"({lat:.1f}ms, SHA={body.get('metadata', {}).get('checkpoint_sha256', '')[:8]})")

    # 7. PCA Latent Embeddings (2D Projections + Precomputed 16D rankings)
    ok, code, lat, hdrs, body = run_http(f"{base_url}/api/embeddings/pca")
    has_pca = ok and len(body.get("users", [])) == 16 and len(body.get("items", [])) == 20
    check("7. Latent PCA Embeddings (16 users, 20 items)", has_pca, f"({lat:.1f}ms, users={len(body.get('users', []))}, items={len(body.get('items', []))})")

    # 8. Recommendation Profiles
    ok, code, lat, hdrs, body = run_http(f"{base_url}/api/recommendation/profiles")
    has_profiles = ok and len(body) >= 16
    check("8. Amazon Clothing Profiles (/profiles)", has_profiles, f"({lat:.1f}ms, profiles={len(body)})")

    # 9. LightGCN Live Inference
    ok, code, lat, hdrs, body = run_http(
        f"{base_url}/api/recommendations",
        method="POST",
        data={"user_id": "usr_00", "model": "LightGCN", "top_k": 5}
    )
    is_live = ok and body.get("mode") == "LIVE_INFERENCE" and len(body.get("items", [])) == 5
    top_score = body.get("items", [{}])[0].get("score", 0) if ok else 0
    check("9. LightGCN Live Inference (Top-5)", is_live, f"({lat:.1f}ms, Top#1 score={top_score})")

    # 10. Truncated SVD Sample Inference
    ok, code, lat, hdrs, body = run_http(
        f"{base_url}/api/recommendations",
        method="POST",
        data={"user_id": "usr_00", "model": "MF", "top_k": 5}
    )
    is_svd = ok and body.get("mode") == "SAMPLE_SVD_INFERENCE" and len(body.get("items", [])) == 5
    check("10. Truncated SVD Matrix Factorization", is_svd, f"({lat:.1f}ms)")

    # 11. GraphRAG Knowledge Simulation
    ok, code, lat, hdrs, body = run_http(
        f"{base_url}/api/graphrag/query",
        method="POST",
        data={"query": "Find elegant evening silk gown"}
    )
    is_rag = ok and "Grounded" in body.get("answer", "") or "Verified" in body.get("answer", "")
    check("11. GraphRAG Query Synthesis", is_rag, f"({lat:.1f}ms)")

    # 12. Rate Limit Enforcement Test (Sliding Window 120 req/min)
    print("Testing Rate Limiting (Firing burst requests)...", end=" ", flush=True)
    burst_blocked = False
    for i in range(125):
        ok, code, _, _, _ = run_http(f"{base_url}/api/models")
        if code == 429:
            burst_blocked = True
            break
    check("12. Rate Limiting Protection (HTTP 429 on Burst)", burst_blocked, f"(Blocked after burst)")

    # Summary
    passed_count = sum(1 for _, s in test_results if s)
    total_count = len(test_results)
    print("\n" + "=" * 65)
    print(f"SMOKE TEST SUMMARY: {passed_count}/{total_count} PASSED")
    print("=" * 65)

    if passed_count == total_count:
        print("ALL TESTS PASSED WITH 100% SUCCESS.")
        sys.exit(0)
    else:
        print("SOME TESTS FAILED OR DEGRADED.")
        sys.exit(1)

if __name__ == "__main__":
    main()
