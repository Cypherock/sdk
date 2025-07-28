# ---------- Stage 1: Build documentation ----------
FROM python:3.11-slim as builder

# Install venv and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Copy requirements and install packages
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files and build documentation
WORKDIR /app
COPY . .
RUN mkdocs build

# ---------- Stage 2: Serve built documentation ----------
FROM nginx:alpine as final

COPY --from=builder /app/site /usr/share/nginx/html

EXPOSE 80
