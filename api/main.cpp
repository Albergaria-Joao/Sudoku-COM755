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

bool preencher(Tabuleiro& tab, int l = 0, int c = 0);
bool verificar(Tabuleiro& tab, int l, int c, int num);
void gerarTab(Tabuleiro& tab, int dif);
bool resolver(Tabuleiro& tab, std::vector<std::pair<int,int>> preenchidos, int l = 0, int c = 0);
bool criarJogo(Tabuleiro& tab, int nSolucoes, int dificuldade);
using json = nlohmann::json;

bool stop = false;

using namespace httplib;

#define PORT 5000


int main() {
    httplib::Server svr;

    svr.Post("/verificar", [](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            Tabuleiro tabuleiro = body["tabuleiro"];

            bool valido = verificar(tabuleiro, body["r"], body["c"], body["num"]);

            json resposta = { {"valido", valido} };
            res.set_content(resposta.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"erro\": \"JSON inválido\"}", "application/json");
        }
    });


    // Habilita CORS corretamente (uma vez só)
    svr.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        return httplib::Server::HandlerResponse::Unhandled;
    });

    // Responde requisições OPTIONS (preflight)
    svr.Options(R"(.*)", [](const httplib::Request& req, httplib::Response& res) {
        res.status = 200; // OK
        // NÃO adicionar headers aqui de novo! Já vêm do pre_routing_handler
    });

    svr.Post("/gerar", [](const httplib::Request& req, httplib::Response& res) {
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
        }
    });

    svr.Post("/resolver", [](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            Tabuleiro tab = body["tabuleiro"];
            srand(time(0));

            std::vector<std::pair<int,int>> preenchidos;

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

            std::cout << "Tempo: " << duration.count() << "s\n";

            //std::cout << "resolvido";
            json resposta = {
                {"tabuleiro", tab},
                {"sucesso", sucesso},
                {"time", duration.count()}
            };
            std::cout << resposta.dump(2) << std::endl;
            std::cout << duration.count();
            res.set_content(resposta.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"erro\": \"JSON inválido\"}", "application/json");
        }
    });


    //std::cout << "Servidor rodando em http://localhost:5000\n";
    svr.listen("0.0.0.0", PORT);
    return 0;
}


bool verificar(Tabuleiro& tab, int l, int c, int num) {
    // Verificar se não tem igual na linha e coluna
    for (int i = 0; i < 9; i++) {
        if (tab[i][c] == num || tab[l][i] == num) {
            return false;
        }
    }

    // Verificar se não tem igual nos "sub" quadradinhos 3x3
    int pX, pY;
    if (l < 3) {
        pX = 1;
    } else if (l < 6) {
        pX = 4;
    } else {
        pX = 7;
    }

    if (c < 3) {
        pY = 1;
    } else if (c < 6) {
        pY = 4;
    } else {
        pY = 7;
    }
    
    for (int i = -1; i < 2; i++) {
        for (int j = -1; j < 2; j++) {
            if (tab[pX + i][pY + j] == num) {
                return false;
            }
        }
    }

    return true;
}   

bool preencher(Tabuleiro& tab, int l, int c) {
    
    if (l == 9) {
        return true;
    }

    int proxL = (c == 8) ? l + 1 : l;
    int proxC = (c + 1) % 9;
    
    std::vector<int> numeros = {1,2,3,4,5,6,7,8,9};

    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::default_random_engine rng(seed);

    std::shuffle(numeros.begin(), numeros.end(), rng);

    for (int num : numeros) {
        if (verificar(tab, l, c, num)) {
            tab[l][c] = num;
            if (preencher(tab, proxL, proxC)) {
                return true;
            }
            tab[l][c] = 0; // Se o próximo não tiver conseguido preencher, volta e vai para o próximo número neste aqui
        }
    }

    return false;
}

void gerarTab(Tabuleiro& tab, int dif) {

    int n_brancos, max, min;

    switch (dif) {
        case 0:
            max = 45;
            min = 32;
            //std::cout << "facil";
            break;
        case 1:
            min = 46;
            max = 49;
            //std::cout << "medio";
            break;
        case 2:
            min = 50;
            max = 53;
            //std::cout << "dificil";
            break;
        case 3:
            min = 54;
            max = 58;
            //std::cout << "dificil";
            break;  
        case 4:
            min = 59;
            max = 64;
            //std::cout << "dificil";
            break;  

    }
    n_brancos = rand() % (max - min + 1) + min;

    for (int i = 0; i < n_brancos; i++) {
        bool apagou = false;
        while (apagou == false) {
            int r_l = rand() % 9; // Número aleatório de 0 a 8
            int r_c = rand() % 9;// Número aleatório de 0 a 8
            if (tab[r_l][r_c] != 0) {
                tab[r_l][r_c] = 0;
                apagou = true;
            }
            else {
                continue;
            }
        }

    }
}

bool contemPar(const std::vector<std::pair<int,int>>& v, int i, int j) {
    return std::any_of(v.begin(), v.end(),
        [i,j](const std::pair<int,int>& p){ return p.first == i && p.second == j; });
}


bool resolver(Tabuleiro& tab, std::vector<std::pair<int,int>> preenchidos, int l, int c) {
    if (l == 9) {
        return true;
    }

    int proxL = (c == 8) ? l + 1 : l;
    int proxC = (c + 1) % 9;
    
    std::vector<int> numeros = {1,2,3,4,5,6,7,8,9};

    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::default_random_engine rng(seed);

    std::shuffle(numeros.begin(), numeros.end(), rng);
    
    if (contemPar(preenchidos, l, c)) {
        //std::cout << l << " " << c << "\n";
        return resolver(tab, preenchidos, proxL, proxC);

    }
    
    for (int num : numeros) {
        if (verificar(tab, l, c, num)) {
            tab[l][c] = num;
            //std::cout << "SOCORRO\n";

            if (resolver(tab, preenchidos, proxL, proxC)) {
                return true;
            }
            tab[l][c] = 0; // Se o próximo não tiver conseguido preencher, volta e vai para o próximo número neste aqui
            
        }
    }

    return false;
}



bool criarJogo(Tabuleiro& tab, int nSolucoes, int dificuldade) {
    std::vector<Tabuleiro> encontradas = {};
    int tentativas = 0;
    while (encontradas.size() < nSolucoes && tentativas < 10000) {
        Tabuleiro novoTab = {};
        preencher(novoTab);
        encontradas.push_back(novoTab); // A solução completa conta como uma solução encontrada
        gerarTab(novoTab, dificuldade);

        Tabuleiro copiaTab = novoTab;
        std::vector<std::pair<int,int>> preenchidos;

        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (novoTab[i][j] != 0) {
                    preenchidos.push_back({i, j}); // Dá append desses valores à lista de preenchidos
                }
            }
        }
        tentativas++;
        for (int i = 0; i < 10; i++) {
            bool sucesso = resolver(copiaTab, preenchidos);
            
            if (sucesso && std::find(encontradas.begin(), encontradas.end(), copiaTab) == encontradas.end()) {
                encontradas.push_back(copiaTab);
            }
            if (encontradas.size() >= nSolucoes) {
                tab = novoTab;
                
                std::cout << "\nJogo criado com " << nSolucoes << " solucoes.\n";
                for (int l = 0; l < encontradas.size(); l++) {
                    Tabuleiro t = encontradas[l];
                    for (int j = 0; j < 9; j++) {
                        for (int k = 0; k < 9; k++) {
                            std::cout << t[j][k] << " ";
                        }
                        std::cout << "\n";
                    }
                    std::cout << "\n";
                }
                return true;
            }
        }
        std::cout << "\nFalhou. Gerar novo tabuleiro " << encontradas.size() << "/" << nSolucoes << " tentativas " << tentativas <<"\n";
        encontradas = {};
    }
    return false;
}
