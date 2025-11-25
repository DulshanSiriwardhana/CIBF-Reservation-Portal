FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["npm", "start"]
