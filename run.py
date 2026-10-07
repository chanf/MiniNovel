import argparse
import os

import uvicorn

from server.app import create_app


def parse_args():
    parser = argparse.ArgumentParser(description="MiniNovel local web service")
    parser.add_argument("--host", default=os.environ.get("MININOVEL_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=os.environ.get("MININOVEL_PORT", "5173"))
    # The deployment script uses this marker to identify only its own process.
    parser.add_argument("--deployment-id", default=None, help=argparse.SUPPRESS)
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("port must be between 1 and 65535")
    return args


if __name__ == "__main__":
    args = parse_args()
    uvicorn.run(create_app(), host=args.host, port=args.port)
