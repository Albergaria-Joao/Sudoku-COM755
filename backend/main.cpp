#include <iostream>
#include <algorithm>
#include <random>
#include <chrono>
#include <cstring> 
//#include "httplib.h"
//#include <nlohmann/json.hpp>

#include <cstdlib> // Needed for rand() and srand()
#include <ctime>   // Needed for time()


bool preencher(int tab[9][9], int l = 0, int c = 0);
bool verificar(int tab[9][9], int l, int c, int num);
void criarJogo(int tab[9][9], int n_brancos);

//using json = nlohmann::json;

int main() {

    int tabuleiro[9][9] = {0}; 
    std::cout << "Hello world\n"; // cout = character out

    preencher(tabuleiro);
    srand(time(0));
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            std::cout << tabuleiro[i][j] << " ";
        }
        std::cout << "\n";
    }
    
    int jogo[9][9];

    std::memcpy(jogo, tabuleiro, sizeof(tabuleiro));
    std::cout << "Copiou\n";
    criarJogo(jogo, 40);
    

    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            std::cout << jogo[i][j] << " ";
        }
        std::cout << "\n";
    }
    
    return 0;
}
  
bool verificar(int tab[9][9], int l, int c, int num) {
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

bool preencher(int tab[9][9], int l, int c) {
    
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

void criarJogo(int tab[9][9], int n_brancos) {
    for (int i = 0; i < n_brancos; i++) {
        int r_l = rand() % 9;
        int r_c = rand() % 9;
        if (tab[r_l][r_c] != 0) {
            tab[r_l][r_c] = 0;
        }

    }
}


    // for (int i = 0; i < 9; i++) {
    //     for (int j = -1; j < 2; j++) {
    //         for (int k = -1; k < 2; k++) {
    //             tabuleiro[pivos[i][0] + j][pivos[i][1] + k] = i;
    //         }
    //     }
    // }

    // int nums[9] = {1,2,3,4,5,6,7,8,9};

    // for (int i = 0; i < 9; i++) {
    //     for (int j = 0; j < 9; j++) {

    //         for (int k = 0; k < 9; k++) {
    //             int valor = nums[k];
                
    //             bool impedido = false;


    //             for (int l = 0; l < 9; l++) {
    //                 if (tabuleiro[i][l] == valor || tabuleiro[l][j] == valor) {
    //                     impedido = true;
    //                     break;
    //                 }
    //             }
    //             if (impedido == false) {
    //                 tabuleiro[i][j] = valor;
    //                 break;
    //             }
    //         }
            
            

    //     }
    //     //std::cout << "\n";
    // }
