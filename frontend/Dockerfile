FROM node:22-slim AS test
WORKDIR /workspace
RUN apt-get update \
  && apt-get install -y --no-install-recommends bash make \
  && rm -rf /var/lib/apt/lists/*
COPY . .
RUN .workflows/verify-layout.sh
RUN make test
