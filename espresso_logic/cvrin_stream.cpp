/*
    module: cvrin_steam.cpp
    purpose: cube and cover input routines with std::iostream
*/

#include <string>
#include <istream>
#include "espresso.h"

static bool line_length_error;
static int lineno;

std::string get_word(std::istream& is) {
    std::string word;
    char ch;

    // Skip leading whitespace
    while (is.get(ch) && std::isspace(ch));

    // If we reached EOF, return an empty string
    if (is.eof()) return "";

    word += ch;

    // Read characters until the next whitespace or EOF
    while (is.get(ch) && !std::isspace(ch)) {
        word += ch;
    }

    return word;
}

void read_cube(register FILE* fp, pPLA PLA) {
    int var, i;
    pcube cf = cube.temp[0], cr = cube.temp[1], cd = cube.temp[2];
    bool savef = false, saved = false, saver = false;
    std::string token;
    int varx, first, last, offset;

    set_clear(cf, cube.size);
}
