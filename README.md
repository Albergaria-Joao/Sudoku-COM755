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
* **TypeScript**: Superconjunto sintático estrito de JS. Adiciona tipagem estática opcional.

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

## Principais dificuldades

Para este projeto, decidi me desafiar a trabalhar com uma linguagem com que tive pouquíssimo contato (C++) e tecnologias que vi necessidade de aprender/praticar mais (React, TypeScript, Prisma, Postgres).

Acredito, portanto, que uma de minhas principais dificuldades tenha sido justamente a adaptação à sintaxe do C++ e à forma como o desenvolvimento web nesse paradigma funciona. 

Também posso citar a integração entre as 3 partes do sistema por meio de web socket (especialmente do C++, que foi bastante trabalhosa e requeriu muita pesquisa).

Nesse contexto, alguns vídeos que me ajudaram no processo de aprendizado foram:
* [Learn Prisma In 60 Minutes - Web Dev Simplified](https://www.youtube.com/watch?v=RebA5J-rlwg)
* [Curso de React para Completos Iniciantes - Felipe Rocha](https://www.youtube.com/watch?v=2RWsLmu8yVc)
* [CURSO DE TYPESCRIPT NA PRÁTICA - APRENDA TYPESCRIPT EM 1 HORA - Matheus Battisti](https://www.youtube.com/watch?v=lCemyQeSCV8)
* [Docker em 22 minutos - teoria e prática - Ayrton Teshima](https://www.youtube.com/watch?v=Kzcz-EVKBEQ)

Apesar dos desafios, acredito que tenha valido a pena: consegui desenvolver um trabalho único entre meus colegas, adicionando ao meu portfólio um projeto com tecnologias altamente relevantes.

Obs.: algo que pode ser notado é que, no C++, usei nomes de variáveis e métodos em português (foi a primeira parte que fiz) e o frontend, em inglês (porque fui fazendo junto com os tutoriais). Quando vi, já era tarde demais para "traduzir" um dos dois.

---

## Resultados e análise

Com relação aos algoritmos, foi possível perceber as seguintes observações:
* O solver básico 100% aleatório é o mais volátil, apresentando tempos de resolução muito díspares para um mesmo tabuleiro quando aplicado várias vezes, justamente por essa volatilidade. Fica na casa dos milissegundos, em geral.
* O que utiliza eliminação de possibilidades por célula apresenta desempenho muito superior (justamente por afunilar os testes do backtracking), com um tempo de execução muito menor e é mais consistente. Precisa de décimos de milissegundo para resolver um tabuleiro de qualquer dificuldade.
* Já o que implementa X-Wing (uma forma mais sofisticada de eliminar as possibilidades), embora não tenha tanta diferença em tempo para o 2º, apresenta desempenho um pouco melhor e, assim como ele, fica na casa dos décimos de milissegundo.

Na tabela que segue, estão os tempos médios de cada algoritmo, em milissegundos, na resolução dos tabuleiros de cada dificuldade:

| Dificuldade | Aleatório (ms) | Elim. Possib. (ms) | X-Wing (ms) |
| :------- | :------: | :-------: | -------: | 
| Fácil | 0.25 | 0.18 | 0.16 |
| Médio | 2.15 | 0.21 | 0.18 |
| Difícil | 4.76 | 0.23 | 0.19 |
| Expert | 28.44 | 0.22 | 0.18 |
| Insano | 71.36 | 0.25 | 0.19 |

### Possíveis melhorias

O principal gargalo do programa se encontra na geração de jogos: tabuleiros mais difíceis e com 2/3 soluções podem demorar um tempo indeterminado para serem criados (uma vez que é preciso encontrar um jogo que tenha exatamente N soluções, o que leva várias iterações de tabuleiros sendo gerados e resolvidos).

Por restrições de tempo, não foi possível aprimorar esse algoritmo, porém uma possibilidade a explorar é o uso de multithreading.

No mais, a entrega atendeu a todos os requisitos explicitados pelo professor.

---

## Como executar o projeto

### Executando localmente

#### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/)
* [NPM](https://www.npmjs.com/)
* [MinGW-w64](https://www.mingw-w64.org/source/)
* [PostgreSQL](https://www.postgresql.org/download/)
---

#### Passo a passo

1.  **Clone o repositório**

    Utilizando Github Desktop ou linha de comando git

2.  **Crie um arquivo `.env` na pasta `web/prisma`**

    Com o conteúdo:
    ```
    DATABASE_URL="postgresql://usuario:senha@localhost:PORTA/sudoku"
    // Substitua pelas suas credenciais e porta
    ```
    
3.  **Execute a migration**

    Na pasta `web/prisma` em um terminal, execute
    ```bash
    npx prisma migrate dev
    ```
    Isso vai colocar o schema sobre o banco Postgres
    
4.  **Instale as dependências**

    Na pasta `web` em um terminal, execute
    ```bash
    npm run dev
    ```
    
5.  **Inicie o backend**

    No diretório `web/server`, execute
    ```bash
    node index.js
    ```

6.  **Inicie a API C++**

    Na pasta `api` em um terminal, rode:
    ```bash
    g++ main.cpp -o build/server -std=c++17 -lws2_32

    .\build\server.exe
    ```
    Para fazer o build e executar o servidor, respectivamente

7.  **Execute o frontend**

    Por fim, na pasta `web`, rode:
    ```bash
    npm run dev
    ```
    O frontend estará rodando na porta exibida (ex: `http://localhost:5173`.

    Para testar o projeto, agora, é só ir até essa URL.
