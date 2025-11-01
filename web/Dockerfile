# Estágio 1: Build da aplicação React
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de definição de pacotes e instala as dependências
# Isso aproveita o cache do Docker, reinstalando dependências apenas se o package.json mudar
COPY package*.json ./
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Executa o build da aplicação para produção
RUN npm run build

# Estágio 2: Servir os arquivos estáticos com Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
