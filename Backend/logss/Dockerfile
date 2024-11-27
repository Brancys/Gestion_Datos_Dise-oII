FROM node:18 
WORKDIR /app 
COPY package*.json ./ 
RUN npm install 
COPY . . 
EXPOSE 3015 
CMD ["npm", "start"]