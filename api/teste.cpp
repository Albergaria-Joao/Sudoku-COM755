#include <iostream>
#include <algorithm>
#include <random>
#include <chrono>
#include <cstring> 
#include <array>
#include <vector>
#include <string>
//#include "httplib.h"
//#include <nlohmann/json.hpp>

#include <cstdlib> // Needed for rand() and srand()
#include <ctime>   // Needed for time()

using Tabuleiro = std::array<std::array<int, 9>, 9>;

bool preencher(Tabuleiro& tab, int l = 0, int c = 0);
bool verificar(Tabuleiro& tab, int l, int c, int num);
void criarJogo(Tabuleiro& tab, int n_brancos);
std::vector<int> possibilidades(Tabuleiro& tab, int l, int c);
bool resolver(Tabuleiro& tab, std::vector<std::pair<int,int>> preenchidos, int l = 0, int c = 0, int tecnica=0);
bool xwing(Tabuleiro& tab);
//using json = nlohmann::json;



int main() {

    Tabuleiro tab{}; 
    std::cout << "Hello world\n"; // cout = character out

    preencher(tab);
    srand(time(0));
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            std::cout << tab[i][j] << " ";
        }
        std::cout << "\n";
    }
    
    Tabuleiro jogo = tab; // Com essa estrutura de dado, consigo fazer essa cópia sem precisar do memcpy
    //std::memcpy(jogo, tab, sizeof(tab));
    std::cout << "Copiou\n";
    criarJogo(jogo, 40);
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            std::cout << jogo[i][j] << " ";
        }
        std::cout << "\n";
    }
    


    std::vector<std::pair<int,int>> preenchidos;

    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (jogo[i][j] != 0) {
                preenchidos.push_back({i, j}); // Dá append desses valores à lista de preenchidos
                //std::cout << i << " " << j << "\n";
            }
        }
    }


    std::cout << "Resolvido:\n";
    std::cout << resolver(jogo, preenchidos, 0, 0, 2) << " resultado\n";

    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            std::cout << jogo[i][j] << " ";
        }
        std::cout << "\n";
    }
    
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

void criarJogo(Tabuleiro& tab, int n_brancos) {
    for (int i = 0; i < n_brancos; i++) {
        int r_l = rand() % 9; // Número aleatório de 0 a 8
        int r_c = rand() % 9;// Número aleatório de 0 a 8
        if (tab[r_l][r_c] != 0) {
            tab[r_l][r_c] = 0;
        }

    }
}

bool contemPar(const std::vector<std::pair<int,int>>& v, int i, int j) {
    return std::any_of(v.begin(), v.end(),
        [i,j](const std::pair<int,int>& p){ return p.first == i && p.second == j; });
}

bool resolver(Tabuleiro& tab, std::vector<std::pair<int,int>> preenchidos, int l, int c, int tecnica) {
    if (l == 9) {
        return true;
    }

    int proxL = (c == 8) ? l + 1 : l;
    int proxC = (c + 1) % 9;
    
    if (contemPar(preenchidos, l, c)) { // Se a casinha atual é uma que já estava preenchida por padrão, pula para a proxiam
        //std::cout << l << " " << c << "\n";
        return resolver(tab, preenchidos, proxL, proxC);
    }

    std::vector<int> numeros;
    switch (tecnica) {
        case 0:
            numeros = {1,2,3,4,5,6,7,8,9};
            break;
        case 1:
            numeros = possibilidades(tab, l, c);
            break;
        case 2:
            while (xwing(tab)) {}

            numeros = possibilidades(tab, l, c);
            break;
    }
    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::default_random_engine rng(seed);

    std::shuffle(numeros.begin(), numeros.end(), rng);
    
    
    
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

bool contem(const std::vector<int>& v, int valor) {
    return std::find(v.begin(), v.end(), valor) != v.end();
}


std::vector<int> possibilidades(Tabuleiro& tab, int l, int c) {
    // Verificar se não tem igual na linha e coluna
    std::vector<int> numeros = {1,2,3,4,5,6,7,8,9};

    for (int i = 0; i < 9; i++) {

        
        if (tab[i][c] != 0 && contem(numeros, tab[i][c])) {
            numeros.erase(std::remove(numeros.begin(), numeros.end(), tab[i][c]), numeros.end()); // Apaga o valor das possibilidades
        }
        if (tab[l][i] != 0 && contem(numeros, tab[l][i])) {
            numeros.erase(std::remove(numeros.begin(), numeros.end(), tab[l][i]), numeros.end());
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
            if (tab[pX + i][pY + j] != 0 && contem(numeros, tab[pX + i][pY + j])) {
                numeros.erase(std::remove(numeros.begin(), numeros.end(), tab[pX + i][pY + j]), numeros.end());
            }
        }
    }

    // std::string s = "[";
    // for (size_t i = 0; i < numeros.size(); i++) {
    //     s += std::to_string(numeros[i]);
    //     if (i + 1 < numeros.size()) s += ", ";
    // }
    // s += "]";
    // std::cout << l << "," << c << " N: " << s << "\n";

    return numeros;
}   


bool xwing(Tabuleiro& tab) {
    bool mudou = false;

    // Pré-calcula possibilidades
    std::array<std::array<std::vector<int>, 9>, 9> poss;
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (tab[i][j] == 0)
                poss[i][j] = possibilidades(tab, i, j);
            else
                poss[i][j] = {};
        }
    }

    // ============================
    // X-WING nas LINHAS
    // ============================
    for (int num = 1; num <= 9; num++) {
        for (int l1 = 0; l1 < 9; l1++) {

            // Pega colunas onde o num pode ir na linha l1
            std::vector<int> cols1;
            for (int c = 0; c < 9; c++)
                if (tab[l1][c] == 0 && contem(poss[l1][c], num))
                    cols1.push_back(c);

            if (cols1.size() != 2) continue; // X-Wing precisa de 2 colunas

            for (int l2 = l1 + 1; l2 < 9; l2++) {

                std::vector<int> cols2;
                for (int c = 0; c < 9; c++)
                    if (tab[l2][c] == 0 && contem(poss[l2][c], num))
                        cols2.push_back(c);

                if (cols2 == cols1) {
                    // -> X-WING encontrado!
                    int cA = cols1[0];
                    int cB = cols1[1];

                    for (int lx = 0; lx < 9; lx++) {
                        if (lx == l1 || lx == l2) continue;

                        // Eliminando do restante das linhas
                        if (tab[lx][cA] == 0 && contem(poss[lx][cA], num)) {
                            tab[lx][cA] = tab[lx][cA]; // apenas marca
                            poss[lx][cA].erase(std::remove(poss[lx][cA].begin(), poss[lx][cA].end(), num), poss[lx][cA].end());
                            mudou = true;
                        }
                        if (tab[lx][cB] == 0 && contem(poss[lx][cB], num)) {
                            poss[lx][cB].erase(std::remove(poss[lx][cB].begin(), poss[lx][cB].end(), num), poss[lx][cB].end());
                            mudou = true;
                        }
                    }
                }
            }
        }
    }

    // ============================
    // X-WING nas COLUNAS
    // ============================
    for (int num = 1; num <= 9; num++) {
        for (int c1 = 0; c1 < 9; c1++) {

            // linhas onde o num pode ir na coluna c1
            std::vector<int> lin1;
            for (int l = 0; l < 9; l++)
                if (tab[l][c1] == 0 && contem(poss[l][c1], num))
                    lin1.push_back(l);

            if (lin1.size() != 2) continue;

            for (int c2 = c1 + 1; c2 < 9; c2++) {

                std::vector<int> lin2;
                for (int l = 0; l < 9; l++)
                    if (tab[l][c2] == 0 && contem(poss[l][c2], num))
                        lin2.push_back(l);

                if (lin2 == lin1) {
                    // -> X-WING encontrado!
                    int rA = lin1[0];
                    int rB = lin1[1];

                    for (int cx = 0; cx < 9; cx++) {
                        if (cx == c1 || cx == c2) continue;

                        if (tab[rA][cx] == 0 && contem(poss[rA][cx], num)) {
                            poss[rA][cx].erase(std::remove(poss[rA][cx].begin(), poss[rA][cx].end(), num), poss[rA][cx].end());
                            mudou = true;
                        }
                        if (tab[rB][cx] == 0 && contem(poss[rB][cx], num)) {
                            poss[rB][cx].erase(std::remove(poss[rB][cx].begin(), poss[rB][cx].end(), num), poss[rB][cx].end());
                            mudou = true;
                        }
                    }
                }
            }
        }
    }

    return mudou;
}
