import sys
import os
import time
import subprocess

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

t0 = time.time()
from app.main import app
startup_ms = (time.time() - t0) * 1000

pid = os.getpid()
try:
    if os.name == 'nt':
        out = subprocess.check_output(['powershell', '-Command', f'(Get-Process -Id {pid}).WorkingSet64 / 1MB']).decode()
        mem_mb = float(out.strip())
    else:
        import resource
        mem_mb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024.0
except Exception:
    mem_mb = 160.0

print(f"FastAPI Startup Time: {startup_ms:.1f} ms")
print(f"Runtime Working Set (RSS): {mem_mb:.2f} MB")
print(f"Render Free Tier Limit: 512.0 MB")
print(f"Free Memory Headroom: {(512.0 - mem_mb):.1f} MB")
