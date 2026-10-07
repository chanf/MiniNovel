"""Manage only the local process started by deploy.sh, never an occupied port."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import shlex
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from uuid import uuid4

ROOT = Path(__file__).resolve().parent.parent
STATE_DIR = ROOT / ".deploy" / "local"
STATE_FILE = STATE_DIR / "process.json"
LOG_FILE = STATE_DIR / "server.log"


def read_state():
    try:
        state = json.loads(STATE_FILE.read_text())
        if isinstance(state.get("pid"), int) and state["pid"] > 1 and isinstance(state.get("token"), str):
            return state
    except (OSError, ValueError):
        pass
    return None


def owned_process(state):
    if not state:
        return False
    result = subprocess.run(
        ["ps", "-p", str(state["pid"]), "-o", "args="],
        capture_output=True, text=True, check=False,
    )
    try:
        args = shlex.split(result.stdout)
        index = args.index("--deployment-id")
        return args[index + 1] == state["token"] and str(ROOT / "run.py") in args
    except (ValueError, IndexError):
        return False


def healthy(port):
    # A loopback health check must not use the user's HTTP proxy.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(f"http://127.0.0.1:{port}/api/health", timeout=1) as response:
            return json.load(response).get("status") == "ok"
    except (OSError, ValueError, urllib.error.URLError):
        return False


def stop():
    state = read_state()
    if not owned_process(state):
        print("No managed MiniNovel process is running.")
        STATE_FILE.unlink(missing_ok=True)
        return
    os.kill(state["pid"], signal.SIGTERM)
    for _ in range(100):
        if not owned_process(state):
            STATE_FILE.unlink(missing_ok=True)
            print("MiniNovel stopped. Project data was retained.")
            return
        time.sleep(0.1)
    raise RuntimeError("The process did not stop within 10 seconds; its PID record was retained.")


def start(port, data_dir):
    state = read_state()
    if owned_process(state):
        print(f"MiniNovel is already running: http://127.0.0.1:{state['port']}")
        return
    with socket.socket() as probe:
        try:
            probe.bind(("127.0.0.1", port))
        except OSError as error:
            raise RuntimeError(f"Port {port} is occupied. Choose MININOVEL_PORT; no existing service was stopped.") from error
    token = uuid4().hex
    environment = {**os.environ, "MININOVEL_DATA_DIR": str(data_dir), "PYTHONUNBUFFERED": "1"}
    with LOG_FILE.open("ab") as log:
        process = subprocess.Popen(
            [sys.executable, str(ROOT / "run.py"), "--host", "127.0.0.1", "--port", str(port), "--deployment-id", token],
            cwd=ROOT, env=environment, stdout=log, stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL, start_new_session=True,
        )
    state = {"pid": process.pid, "token": token, "port": port, "data_dir": str(data_dir)}
    temporary = STATE_FILE.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, indent=2))
    temporary.chmod(0o600)
    temporary.replace(STATE_FILE)
    for _ in range(150):
        if process.poll() is not None:
            STATE_FILE.unlink(missing_ok=True)
            raise RuntimeError(f"Startup failed. Inspect {LOG_FILE} with 'local logs'.")
        if healthy(port):
            print(f"MiniNovel started: http://127.0.0.1:{port}")
            print(f"Data: {data_dir}")
            print(f"Log: {LOG_FILE}")
            return
        time.sleep(0.2)
    stop()
    raise RuntimeError("Startup health check timed out; inspect the local log.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["run", "start", "stop", "restart", "status", "logs"])
    parser.add_argument("--port", type=int, default=9513)
    parser.add_argument("--data-dir", default=str(ROOT / ".data"))
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("Port must be from 1 to 65535")
    data_dir = Path(args.data_dir).expanduser().resolve()
    if args.action == "run":
        os.chdir(ROOT)
        os.environ["MININOVEL_DATA_DIR"] = str(data_dir)
        os.execv(sys.executable, [sys.executable, str(ROOT / "run.py"), "--host", "127.0.0.1", "--port", str(args.port)])
    STATE_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)
    if args.action == "logs":
        if LOG_FILE.exists():
            print("\n".join(LOG_FILE.read_text(errors="replace").splitlines()[-100:]))
        else:
            print("No local deployment log yet.")
        return
    with (STATE_DIR / "process.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if args.action == "stop":
            stop()
        elif args.action == "status":
            state = read_state()
            if owned_process(state):
                health = "healthy" if healthy(state["port"]) else "health check failed"
                print(f"Running ({health}): http://127.0.0.1:{state['port']}, PID {state['pid']}")
            else:
                print("MiniNovel is not running as a managed deployment.")
        else:
            if args.action == "restart":
                stop()
            start(args.port, data_dir)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
