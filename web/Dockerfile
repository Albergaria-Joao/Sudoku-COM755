# web/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Rodando em modo de desenvolvimento para editar em tempo real
CMD ["npm", "run", "dev", "--", "--host"]