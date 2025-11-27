#include <iostream>
#include <algorithm>
#include <random>
#include <chrono>
#include <cstring> 
#include <array>
#include <vector>

//#include "httplib.h"
//#include <nlohmann/json.hpp>

#include <cstdlib> // Needed for rand() and srand()
#include <ctime>   // Needed for time()

using Tabuleiro = std::array<std::array<int, 9>, 9>;

bool preencher(Tabuleiro& tab, int l = 0, int c = 0);
bool verificar(Tabuleiro& tab, int l, int c, int num);
void criarJogo(Tabuleiro& tab, int n_brancos);

bool resolver(Tabuleiro& tab, std::vector<std::pair<int,int>> preenchidos, int l = 0, int c = 0);
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
    std::cout << resolver(jogo, preenchidos) << " resultado\n";

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
    
    while (contemPar(preenchidos, l, c)) {
        //std::cout << l << " " << c << "\n";
        l = proxL;
        c = proxC;

        proxL = (c == 8) ? l + 1 : l;
        proxC = (c + 1) % 9;

    }
    

    // std::cout << "\n";
    // for (int i = 0; i < 9; i++) {
    //     for (int j = 0; j < 9; j++) {
    //         std::cout << tab[i][j] << " ";
    //     }
    //     std::cout << "\n";
    // }

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


std::vector<int> possibilidades(Tabuleiro& tab, int l, int c, int num) {
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
            if (tab[pX + i][pY + j] == num) {
                return false;
            }
        }
    }

    return true;
}   
