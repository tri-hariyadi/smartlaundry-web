# Double-container Dockerfile for separated build process.
# If you're just copy-pasting this, don't forget a .dockerignore!

# We're starting with the same base image, but we're declaring
# that this block outputs an image called DEPS that we
# won't be deploying - it just installs our Yarn deps
FROM node:14-alpine AS deps

# If you need libc for any of your deps, uncomment this line:
# RUN apk add --no-cache libc6-compat

# Copy over ONLY the package.json and yarn.lock
# so that this `yarn install` layer is only recomputed
# if these dependency files change. Nice speed hack!
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# END DEPS IMAGE

# Now we make a container to handle our Build
FROM node:14-alpine AS builder

# Set up our work directory again
WORKDIR /app

# Bring over the deps we installed and now also
# the rest of the source code to build the Next
# server for production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Remove all the development dependencies since we don't
# need them to run the actual server.
RUN rm -rf node_modules
# RUN npm install --production --frozen-lockfile --ignore-scripts --prefer-offline
RUN npm install --production --no-package-lock --ignore-scripts --prefer-offline

# END OF BUILD_IMAGE

# This starts our application's run image - the final output of build.
FROM node:14-alpine AS runner

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Pull the built files out of BUILD_IMAGE - we need:
# 1. the package.json and yarn.lock
# 2. the Next build output and static files
# 3. the node_modules.
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# 4. OPTIONALLY the next.config.js, if your app has one
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js  ./

USER nextjs

EXPOSE 3006

CMD [ "npm", "start" ]


# Install dependencies only when needed
# FROM node:14-alpine AS deps
# RUN apk add --no-cache libc6-compat nasm autoconf automake bash libltdl libtool gcc make g++ zlib-dev
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# # ==================================================================
# # Rebuild the source code only when needed
# FROM node:14-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
# # ENV NEXT_TELEMETRY_DISABLED 1
# RUN npm run build
# RUN rm -rf node_modules
# RUN npm install --production --no-package-lock --ignore-scripts --prefer-offline
# # ==================================================================
# # Production image, copy all the files and run next
# FROM node:14-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED 1
# RUN apk add --no-cache libc6-compat nasm autoconf automake bash
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# # You only need to copy next.config.js if you are NOT using the default configuration
# # COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY .env ./
# # Automatically leverage output traces to reduce image size 
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# # COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# # COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# USER nextjs
# EXPOSE 3006
# ENV PORT 3006
# # CMD ["node", "server.js"]
# CMD [ "npm", "start" ]