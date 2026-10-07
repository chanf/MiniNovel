FROM ghcr.io/astral-sh/uv:0.11.13 AS uv
FROM python:3.12-slim

COPY --from=uv /uv /uvx /usr/local/bin/
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    MININOVEL_DATA_DIR=/data \
    MININOVEL_HOST=0.0.0.0 \
    MININOVEL_PORT=5173
WORKDIR /app
COPY pyproject.toml uv.lock .python-version ./
RUN uv sync --frozen --no-dev --no-editable \
    && groupadd --gid 10001 mininovel \
    && useradd --uid 10001 --gid 10001 --no-create-home mininovel \
    && mkdir /data \
    && chown mininovel:mininovel /data
COPY server/ ./server/
COPY assets/ ./assets/
COPY run.py index.html app.js styles.css ./
USER 10001:10001
EXPOSE 5173
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
    CMD ["/app/.venv/bin/python", "-c", "import json,urllib.request; r=urllib.request.urlopen('http://127.0.0.1:5173/api/health',timeout=2); assert json.load(r)['status']=='ok'"]
CMD ["/app/.venv/bin/python", "/app/run.py"]
