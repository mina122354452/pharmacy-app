
FROM node
WORKDIR /app
COPY package.json /app
RUN npm i 
COPY . .
EXPOSE 4000
CMD ["npm" ,"start"]