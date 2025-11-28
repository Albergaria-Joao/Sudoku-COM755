#define _WIN32_WINNT 0x0A00
#include <iostream>
#include <algorithm>
#include <random>
#include <chrono>
#include <cstring>
#include <array>
#include <vector>

#include "nlohmann/json.hpp"
#include "httplib.h"

#include <cstdlib> // Needed for rand() and srand()
#include <ctime>   // Needed for time()

using Tabuleiro = std::array<std::array<int, 9>, 9>;

bool preencher(Tabuleiro &tab, int l = 0, int c = 0);
bool verificar(Tabuleiro &tab, int l, int c, int num);
void gerarTab(Tabuleiro &tab, int dif);
bool resolver(Tabuleiro &tab, std::vector<std::pair<int, int>> preenchidos, int l = 0, int c = 0, int tecnica = 0);
bool criarJogo(Tabuleiro &tab, int nSolucoes, int dificuldade);
bool xwing(Tabuleiro &tab);
using json = nlohmann::json;

bool stop = false;

using namespace httplib;

#define PORT 5000

int main()
{
    httplib::Server svr;

    svr.Post("/verificar", [](const httplib::Request &req, httplib::Response &res)
             {
        try {
            auto body = json::parse(req.body);
            Tabuleiro tabuleiro = body["tabuleiro"];

            bool valido = verificar(tabuleiro, body["r"], body["c"], body["num"]);

            json resposta = { {"valido", valido} };
            res.set_content(resposta.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"erro\": \"JSON inválido\"}", "application/json");
        } });

    // Habilita CORS
    svr.set_pre_routing_handler([](const httplib::Request &req, httplib::Response &res)
                                {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        return httplib::Server::HandlerResponse::Unhandled; });

    svr.Options(R"(.*)", [](const httplib::Request &req, httplib::Response &res)
                { res.status = 200; });

    svr.Post("/gerar", [](const httplib::Request &req, httplib::Response &res)
             {
        try {
            auto body = json::parse(req.body);
            int dificuldade = body["dificuldade"];
            int nSolucoes = body.value("nSolucoes", 1);
            //std::cout << dificuldade;
            Tabuleiro tab = {};
            srand(time(0));
            bool criou = criarJogo(tab, nSolucoes, dificuldade);
            // preencher(tab);
            
            // gerarTab(tab, dificuldade);
            if (criou == true) {
                json resposta = { {"tabuleiro", tab} };
                res.set_content(resposta.dump(), "application/json");
            }
            else {
                res.status = 500;
                res.set_content("{\"erro\": \"Não foi possível criar o jogo\"}", "application/json");
            }
        } catch (...) {
            res.status = 400;
            res.set_content("{\"erro\": \"JSON inválido\"}", "application/json");
        } });

    svr.Post("/resolver", [](const httplib::Request &req, httplib::Response &res)
             {
        try {
            auto body = json::parse(req.body);
            Tabuleiro tab = body["tabuleiro"];
            Tabuleiro backup = body["tabuleiro"];
            srand(time(0));

            std::vector<std::pair<int,int>> preenchidos = {};

            auto start = std::chrono::steady_clock::now();

            for (int i = 0; i < 9; i++) {
                for (int j = 0; j < 9; j++) {
                    if (tab[i][j] != 0) {
                        preenchidos.push_back({i, j}); // Dá append desses valores à lista de preenchidos
                    }
                }
            }

            bool sucesso = resolver(tab, preenchidos);

            auto end = std::chrono::steady_clock::now();
            std::chrono::duration<double, std::milli> duration = end - start;

            double t_normal = duration.count();

            std::cout << "Tempo: " << duration.count() << "s\n";

            // Algoritmo eliminando as possibilidades de forma simples

            preenchidos = {};

            start = std::chrono::steady_clock::now();

            for (int i = 0; i < 9; i++) {
                for (int j = 0; j < 9; j++) {
                    if (tab[i][j] != 0) {
                        preenchidos.push_back({i, j}); // Dá append desses valores à lista de preenchidos
                    }
                }
            }
            
            sucesso = resolver(backup, preenchidos, 0, 0, 1);

            end = std::chrono::steady_clock::now();
            duration = end - start;

            double t_possib = duration.count();

            // Algoritmo eliminando as possibilidades com o X-Wing

            backup = body["tabuleiro"];

            preenchidos = {};

            start = std::chrono::steady_clock::now();

            for (int i = 0; i < 9; i++) {
                for (int j = 0; j < 9; j++) {
                    if (tab[i][j] != 0) {
                        preenchidos.push_back({i, j}); // Dá append desses valores à lista de preenchidos
                    }
                }
            }
            
            sucesso = resolver(backup, preenchidos, 0, 0, 2);

            end = std::chrono::steady_clock::now();
            duration = end - start;

            double t_xwing = duration.count();

            //std::cout << "resolvido";
            json resposta = {
                {"tabuleiro", tab},
                {"sucesso", sucesso},
                {"tempo", {t_normal, t_possib, t_xwing}}
            };
            std::cout << resposta.dump(2) << std::endl;
            std::cout << duration.count();
            res.set_content(resposta.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"erro\": \"JSON inválido\"}", "application/json");
        } });

    // std::cout << "Servidor rodando em http://localhost:5000\n";
    svr.listen("0.0.0.0", PORT);
    return 0;
}

bool verificar(Tabuleiro &tab, int l, int c, int num)
{
    // Verificar se não tem igual na linha e coluna
    for (int i = 0; i < 9; i++)
    {
        if (tab[i][c] == num || tab[l][i] == num)
        {
            return false;
        }
    }

    // Verificar se não tem igual nos "sub" quadradinhos 3x3
    int pX, pY;
    if (l < 3)
    {
        pX = 1;
    }
    else if (l < 6)
    {
        pX = 4;
    }
    else
    {
        pX = 7;
    }

    if (c < 3)
    {
        pY = 1;
    }
    else if (c < 6)
    {
        pY = 4;
    }
    else
    {
        pY = 7;
    }

    for (int i = -1; i < 2; i++)
    {
        for (int j = -1; j < 2; j++)
        {
            if (tab[pX + i][pY + j] == num)
            {
                return false;
            }
        }
    }

    return true;
}

bool preencher(Tabuleiro &tab, int l, int c)
{

    if (l == 9)
    {
        return true;
    }

    int proxL = (c == 8) ? l + 1 : l;
    int proxC = (c + 1) % 9;

    std::vector<int> numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9};

    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::default_random_engine rng(seed);

    std::shuffle(numeros.begin(), numeros.end(), rng);

    for (int num : numeros)
    {
        if (verificar(tab, l, c, num))
        {
            tab[l][c] = num;
            if (preencher(tab, proxL, proxC))
            {
                return true;
            }
            tab[l][c] = 0; // Se o próximo não tiver conseguido preencher, volta e vai para o próximo número neste aqui
        }
    }

    return false;
}

void gerarTab(Tabuleiro &tab, int dif)
{

    int n_brancos, max, min;

    switch (dif)
    {
    case 0:
        max = 45;
        min = 32;
        // std::cout << "facil";
        break;
    case 1:
        min = 46;
        max = 49;
        // std::cout << "medio";
        break;
    case 2:
        min = 50;
        max = 53;
        // std::cout << "dificil";
        break;
    case 3:
        min = 54;
        max = 58;
        // std::cout << "dificil";
        break;
    case 4:
        min = 59;
        max = 64;
        // std::cout << "dificil";
        break;
    }
    n_brancos = rand() % (max - min + 1) + min;

    for (int i = 0; i < n_brancos; i++)
    {
        bool apagou = false;
        while (apagou == false)
        {
            int r_l = rand() % 9; // Número aleatório de 0 a 8
            int r_c = rand() % 9;
            if (tab[r_l][r_c] != 0)
            {
                tab[r_l][r_c] = 0;
                apagou = true;
            }
            else
            {
                continue;
            }
        }
    }
}

bool contemPar(const std::vector<std::pair<int, int>> &v, int i, int j)
{ // Verifica se os preenchidos contêm o par dado
    return std::any_of(v.begin(), v.end(),
                       [i, j](const std::pair<int, int> &p)
                       { return p.first == i && p.second == j; });
}

bool contem(const std::vector<int> &v, int valor)
{ // Verifica se o valor está no vetor
    return std::find(v.begin(), v.end(), valor) != v.end();
}

// Para ver quais são as possibilidades, caso escolha usar esse método
std::vector<int> possibilidades(Tabuleiro &tab, int l, int c)
{
    // Verificar se não tem igual na linha e coluna
    std::vector<int> numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9};

    for (int i = 0; i < 9; i++)
    {

        if (tab[i][c] != 0 && contem(numeros, tab[i][c]))
        {
            numeros.erase(std::remove(numeros.begin(), numeros.end(), tab[i][c]), numeros.end()); // Apaga o valor das possibilidades
        }
        if (tab[l][i] != 0 && contem(numeros, tab[l][i]))
        {
            numeros.erase(std::remove(numeros.begin(), numeros.end(), tab[l][i]), numeros.end());
        }
    }

    // Verificar se não tem igual nos "sub" quadradinhos 3x3
    int pX, pY;
    if (l < 3)
    {
        pX = 1;
    }
    else if (l < 6)
    {
        pX = 4;
    }
    else
    {
        pX = 7;
    }

    if (c < 3)
    {
        pY = 1;
    }
    else if (c < 6)
    {
        pY = 4;
    }
    else
    {
        pY = 7;
    }

    for (int i = -1; i < 2; i++)
    {
        for (int j = -1; j < 2; j++)
        {
            if (tab[pX + i][pY + j] != 0 && contem(numeros, tab[pX + i][pY + j]))
            {
                numeros.erase(std::remove(numeros.begin(), numeros.end(), tab[pX + i][pY + j]), numeros.end());
            }
        }
    }

    return numeros;
}

bool resolver(Tabuleiro &tab, std::vector<std::pair<int, int>> preenchidos, int l, int c, int tecnica)
{
    if (l == 9)
    {
        return true;
    }

    int proxL = (c == 8) ? l + 1 : l;
    int proxC = (c + 1) % 9;

    if (contemPar(preenchidos, l, c))
    { // Se a casinha atual é uma que já estava preenchida por padrão, pula para a proxiam
        // std::cout << l << " " << c << "\n";
        return resolver(tab, preenchidos, proxL, proxC);
    }

    std::vector<int> numeros;
    switch (tecnica)
    {
    case 0:
        numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9};
        break;
    case 1:
        numeros = possibilidades(tab, l, c);
        break;
    case 2:
        while (xwing(tab))
        {
        }

        numeros = possibilidades(tab, l, c);
        break;
    }
    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::default_random_engine rng(seed);

    std::shuffle(numeros.begin(), numeros.end(), rng);

    for (int num : numeros)
    {
        if (verificar(tab, l, c, num))
        {
            tab[l][c] = num;
            // std::cout << "SOCORRO\n";

            if (resolver(tab, preenchidos, proxL, proxC))
            {
                return true;
            }
            tab[l][c] = 0; // Se o próximo não tiver conseguido preencher, volta e vai para o próximo número neste aqui
        }
    }

    return false;
}

// bool swordfish(Tabuleiro& tab, std::vector<std::pair<int,int>> preenchidos, int l, int c) {

// }

bool criarJogo(Tabuleiro &tab, int nSolucoes, int dificuldade)
{
    std::vector<Tabuleiro> encontradas = {};
    int tentativas = 0;
    while (encontradas.size() < nSolucoes && tentativas < 10000)
    {
        Tabuleiro novoTab = {};
        preencher(novoTab);
        encontradas.push_back(novoTab); // A solução completa conta como uma solução encontrada
        gerarTab(novoTab, dificuldade);

        Tabuleiro copiaTab = novoTab;
        std::vector<std::pair<int, int>> preenchidos;

        for (int i = 0; i < 9; i++)
        {
            for (int j = 0; j < 9; j++)
            {
                if (novoTab[i][j] != 0)
                {
                    preenchidos.push_back({i, j}); // Dá append desses valores à lista de preenchidos
                }
            }
        }
        tentativas++;
        for (int i = 0; i < 10; i++)
        {
            bool sucesso = resolver(copiaTab, preenchidos, 0, 0, 1);

            if (sucesso && std::find(encontradas.begin(), encontradas.end(), copiaTab) == encontradas.end())
            {
                encontradas.push_back(copiaTab);
            }
            if (encontradas.size() >= nSolucoes)
            {
                tab = novoTab;

                std::cout << "\nJogo criado com " << nSolucoes << " solucoes.\n";
                for (int l = 0; l < encontradas.size(); l++)
                {
                    Tabuleiro t = encontradas[l];
                    for (int j = 0; j < 9; j++)
                    {
                        for (int k = 0; k < 9; k++)
                        {
                            std::cout << t[j][k] << " ";
                        }
                        std::cout << "\n";
                    }
                    std::cout << "\n";
                }
                return true;
            }
        }
        std::cout << "\nFalhou. Gerar novo tabuleiro " << encontradas.size() << "/" << nSolucoes << " tentativas " << tentativas << "\n";
        encontradas = {};
    }
    return false;
}

// Para fazer o X-Wing, usei IA pra ir descrevendo o algoritmo mesmo, por conta do tempo.
// Mas é mais para ter esse experimento

// Ele procura duas linhas onde um valor só pode ir nas mesmas duas colunas
// Ou seja, forma um retângulo com esse valor possível
// Nenhuma outra linha pode usar esse valor nas colunas

// Depois, faz o inverso
// procura duas colunas onde um número só pode ir nas mesmas duas linhas
bool xwing(Tabuleiro &tab)
{
    bool mudou = false;

    // Pré-calcula possibilidades
    // Para cada célula, vê quais são as possibilidades dela
    std::array<std::array<std::vector<int>, 9>, 9> poss;
    for (int i = 0; i < 9; i++)
    {
        for (int j = 0; j < 9; j++)
        {
            if (tab[i][j] == 0)
                poss[i][j] = possibilidades(tab, i, j);
            else
                poss[i][j] = {};
        }
    }

    // X-wing nas linhas
    for (int num = 1; num <= 9; num++) // Para cada número
    {
        for (int l1 = 0; l1 < 9; l1++) // Procura 2 linhas que tenham o número somente em duas colunas
        {

            // Pega colunas onde o num pode ir na linha l1
            std::vector<int> cols1;
            for (int c = 0; c < 9; c++)
                if (tab[l1][c] == 0 && contem(poss[l1][c], num))
                    cols1.push_back(c);

            if (cols1.size() != 2)
                continue; // X-Wing precisa de apenas 2 colunas. Se achar o número em mais, simplesmente continua

            for (int l2 = l1 + 1; l2 < 9; l2++) // Compara com outra linha para ver se acha também 2 colunas que tenham esse mesmo número como possibilidade
            {

                std::vector<int> cols2;
                for (int c = 0; c < 9; c++)
                    if (tab[l2][c] == 0 && contem(poss[l2][c], num))
                        cols2.push_back(c); // Adiciona a coluna, se tiver o número como possibilidade

                if (cols2 == cols1) // Se as colunas forem as mesmas entre as linhas
                {
                    //  X-wing encontrado!
                    int cA = cols1[0];
                    int cB = cols1[1];

                    for (int lx = 0; lx < 9; lx++) // Elimina essa valor possível (se houver) das outras linhas nessas colunas
                    {
                        if (lx == l1 || lx == l2)
                            continue;

                        // Eliminando do restante das linhas
                        if (tab[lx][cA] == 0 && contem(poss[lx][cA], num))
                        {
                            tab[lx][cA] = tab[lx][cA]; // apenas marca
                            poss[lx][cA].erase(std::remove(poss[lx][cA].begin(), poss[lx][cA].end(), num), poss[lx][cA].end());
                            mudou = true;
                        }
                        if (tab[lx][cB] == 0 && contem(poss[lx][cB], num))
                        {
                            poss[lx][cB].erase(std::remove(poss[lx][cB].begin(), poss[lx][cB].end(), num), poss[lx][cB].end());
                            mudou = true;
                        }

                        // Quando a célula perder todos os candidatos possíveis menos 1, atualiza no tabuleiro automaticamente
                        if (poss[lx][cA].size() == 1)
                        {
                            tab[lx][cA] = poss[lx][cA][0];
                            mudou = true;
                        }
                        if (poss[lx][cB].size() == 1)
                        {
                            tab[lx][cB] = poss[lx][cB][0];
                            mudou = true;
                        }
                        // Se mudou, é porque o X-wing conseguiu ajudar em alguma coisa.
                        // Se não, vai retornar false e terminar o loop que eu coloquei no resolver()
                    }
                }
            }
        }
    }

    // X-wing nas colunas
    // Faz a mesma coisa, só que indo pelas colunas
    for (int num = 1; num <= 9; num++)
    {
        for (int c1 = 0; c1 < 9; c1++)
        {

            // linhas onde o num pode ir na coluna c1
            std::vector<int> lin1;
            for (int l = 0; l < 9; l++)
                if (tab[l][c1] == 0 && contem(poss[l][c1], num))
                    lin1.push_back(l);

            if (lin1.size() != 2)
                continue;

            for (int c2 = c1 + 1; c2 < 9; c2++)
            {

                std::vector<int> lin2;
                for (int l = 0; l < 9; l++)
                    if (tab[l][c2] == 0 && contem(poss[l][c2], num))
                        lin2.push_back(l);

                if (lin2 == lin1)
                {
                    // x-wing encontrado
                    int rA = lin1[0];
                    int rB = lin1[1];

                    for (int cx = 0; cx < 9; cx++)
                    {
                        if (cx == c1 || cx == c2)
                            continue;

                        if (tab[rA][cx] == 0 && contem(poss[rA][cx], num))
                        {
                            poss[rA][cx].erase(std::remove(poss[rA][cx].begin(), poss[rA][cx].end(), num), poss[rA][cx].end());
                            mudou = true;
                        }
                        if (tab[rB][cx] == 0 && contem(poss[rB][cx], num))
                        {
                            poss[rB][cx].erase(std::remove(poss[rB][cx].begin(), poss[rB][cx].end(), num), poss[rB][cx].end());
                            mudou = true;
                        }

                        if (poss[rA][cx].size() == 1)
                        {
                            tab[rA][cx] = poss[rA][cx][0];
                            mudou = true;
                        }
                        if (poss[rB][cx].size() == 1)
                        {
                            tab[rB][cx] = poss[rB][cx][0];
                            mudou = true;
                        }
                    }
                }
            }
        }
    }

    return mudou;
}
