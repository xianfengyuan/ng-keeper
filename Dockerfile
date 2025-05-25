# ---------- STAGE 1: Build the Angular app ----------
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the full app source
COPY . .

# Build the Angular app in production mode
RUN npm run build -- --output-path=dist

# ---------- STAGE 2: Serve the app with Nginx ----------
FROM nginx:stable-alpine

# Copy the Angular build output to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]