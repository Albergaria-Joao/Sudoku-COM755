# web/server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1. Copia o package.json do SERVER (caminho relativo à pasta web)
COPY server/package*.json ./

# 2. Copia a pasta PRISMA (que está na raiz de web)
COPY prisma ./prisma/

# 3. Instala dependências
RUN npm install

# 4. Gera o cliente do Prisma
RUN npx prisma generate

# 5. Copia o código fonte do SERVER
COPY server/ .

EXPOSE 4000

# Executa
CMD ["node", "index.js"]