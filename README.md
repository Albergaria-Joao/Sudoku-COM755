# Projeto Final COM755 - Sudoku com Backtracking

Facamp - Faculdades de Campinas, Novembro de 2025

Computação de Alto Desempenho - COM755, Prof. MSc. Sérgio Yoshioka

* João Vítor Albergaria Barbosa | 202310501

---

## Visão Geral

Este projeto é uma aplicação web que permite gerar e resolver tabuleiros de Sudoku de diferentes dificuldades usando algoritmos de backtracking em C++, ou resolvê-los jogando normalmente.

### Arquitetura e principais tecnologias

#### Frontend:
* **React**: Biblioteca JS para construir UIs interativas para a web.
* **Tailwind**: Framework CSS para desenvolvimento de interfaces usando classes utilitárias.

#### Backend:
* **Node.js**: Ambiente de execução JS para processamento no servidor.
* **Prisma**: ORM para interação com o banco de dados.
* **PostgresSQL**: sistema de gerenciamento de banco de dados relacional.

#### API:
* **C++**: Linguagem de programação de alto desempenho, usada para toda a manipulação do jogo de Sudoku em si.
* **[cpp-httplib](https://github.com/yhirose/cpp-httplib)**: Biblioteca C++ "header-only" para criar servidores e clientes HTTP/HTTPS. Criada por Yuji Hirose
* **[json](https://github.com/nlohmann/json)**: Biblioteca C++ criada por Niels Lohmann, que permite manipulação de objetos JSON.

---

## Funcionalidades principais

### Geração de tabuleiros de acordo com requisitos do usuário
* **Dificuldade (leva em consideração o número de casas em branco no tabuleiro)**
* **Número de soluções escolhido pelo usuário**

### Resolução de Sudoku com backtracking
* **3 algoritmos para comparação**
    1. Algoritmo que preenche aleatoriamente;
    2. Elimina as possibilidades de cada célula
    3. Implementa a técnica X-Wing.
* **Exibição do tempo de execução de cada algoritmo em formato tabular**

### Jogo de Sudoku usual
* **O tabuleiro gerado/importado também pode ser jogado normalmente**
* **As cores das células mudam dinamicamente**
  1. Destaque para as que estão na mesma linha/coluna/3x3 da célula em foco
  2. Células não editáveis demarcadas
  3. Células inválidas em vermelho, e conflitantes em amarelo
  4. Tabuleiro verde ao resolver

### Upload, salvamento e exportação de jogos
* **É possível criar um jogo a partir de um arquivo CSV em que as células em branco sejam 0**
* **O estado atual do jogo sempre é salvo no banco de dados ao sair**
  1. O jogo poderá, então, ser carregado a partir da tela inicial (onde são mostradas suas informações)
  2. Caso o usuário desejar, poderá deletá-lo também
* **O tabuleiro gerado pelo algoritmo pode ser exportado também como arquivo CSV**

### Login e leaderboards
* **Para acessar o Sudoku, é necessário fazer login (uma vez que os jogos são associados a um usuário)**
  1. É possível se cadastrar facilmente, apenas criando login e senha (criptografada com bcrypt)
* **Os jogos resolvidos manualmente por cada usuário são contabilizados de acordo com a dificuldade para exibir uma leaderboard**
---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 12 ou superior)
* [NPM](https://www.npmjs.com/) ou Yarn.
* [Python](https://www.python.org/downloads/) (Versão sugerida: 3.13).
---

## Como rodar o Projeto

1.  **Clone o repositório**

    Utilizando Github Desktop ou linha de comando git

2.  **Crie um arquivo `.env`**

    Com o conteúdo:
    ```
    MONGO_URI="mongodb+srv://usuario:senha@cluster.xxxxx.mongodb.net/database"
    // Substituta o valor pela URI do seu banco de dados MongoDB
    ```

    Você já deverá ter criado um cluster com as collections membro, tarefa e equipe.

    Para criar uma conta admin com senha admin e conseguir testar, na sua collection membro, cole os seguintes valores em um novo registro:
    ```
    login: "admin"
    senha: Binary.createFromBase64('JDJiJDEyJHFJT0Z5VmpKS0NvNkpBUEE2WEhRZHUxMGJNVFRJTkJ5RDBlQlRoUmdzTHYwbTFZT1haSGtP', 0)
    auth: "admin"
    ```
    
3.  **Inicie o ambiente virtual Python**

    Na pasta `backend`, execute
    ```bash
    python -m venv venv
    ```

    E para ativar:
    ```bash
    venv\Scripts\Activate
    ```

4.  **Instale as bibliotecas Python**

    Ainda no backend e com venv ativado, rode:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Suba o backend**

    ```bash
    python -m flask run
    ```

6.  **Instale as dependências do frontend:**

    Agora, na pasta do frontend:
    ```bash
    npm install
    ```

7.  **Configure a API:**

    Verifique o arquivo `src/api.js`. Certifique-se de que a `baseURL` aponta para o endereço correto do seu Backend (Python/Flask).
    ```javascript
    // Exemplo em src/api.js
    baseURL: '[http://localhost:5000](http://localhost:5000)'
    ```

8.  **Execute o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

9.  **Garanta que o CORS no backend libera a porta correta:**

    Um erro comum é que o backend não autorize o acesso a suas rotas pelo frontend por uma configuração errada do CORS. 

    Certifique-se de que, no arquivo `backend/app/__init__.py`, o parâmetro `origins` tenha a mesma porta indicada no terminal ao rodar o frontend (geralmente 8080 ou 8081)

10.  **Acesse a aplicação:**

    Abra o navegador em `http://localhost:8081` (ou o endereço indicado no terminal).


---
