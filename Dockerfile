# IMAGE
FROM node:24-alpine

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . ./

# Install dependencies & build the project
RUN corepack enable && \
    rm -rf node_modules && \
    pnpm install && \
    rm -rf .output && \
    pnpm run build

# Runtime defaults – overridden at container start via compose environment / env_file
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]