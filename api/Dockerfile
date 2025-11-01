FROM debian:bookworm

# Instala o compilador e utilitários
RUN apt-get update && apt-get install -y g++

# Cria diretório de trabalho
WORKDIR /app

# Copia o código-fonte
COPY . .

# Compila o servidor
RUN g++ main.cpp -o build/server -std=c++17

# Expõe a porta usada pelo servidor
EXPOSE 8080

# Executa o servidor
CMD ["./build/server"]
