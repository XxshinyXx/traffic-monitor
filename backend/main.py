# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

# allow your frontend to fetch; once deployed, restrict origins to your site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/traffic")
def traffic():
    """Run dstat for 1 second and return recv/send (bytes/sec).

    Requires `dstat` installed on the VPS.
    """
    try:
        output = subprocess.check_output(
            ["dstat", "-n", "1", "1", "--nocolor"], stderr=subprocess.STDOUT
        )
    except subprocess.CalledProcessError as e:
        # if dstat missing or fails, return error data
        return {"recv": 0.0, "send": 0.0, "error": str(e.output.decode())}

    lines = output.decode().splitlines()
    # last non-empty line contains numbers
    for line in reversed(lines):
        if line.strip():
            parts = line.split()
            break
    else:
        return {"recv": 0.0, "send": 0.0}

    # There may be multiple columns depending on dstat version. We attempt to read first two floats.
    try:
        recv = float(parts[0])
        send = float(parts[1])
    except Exception:
        recv = 0.0
        send = 0.0

    return {"recv": recv, "send": send}
