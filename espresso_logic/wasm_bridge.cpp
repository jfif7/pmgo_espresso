#include <emscripten.h>

#include <iostream>
#include <string>
extern "C" {
EMSCRIPTEN_KEEPALIVE
const char *run_espresso(std::string input) {
    std::cout << "This is C++!\n";
    const char *ret = input.c_str();
    return ret;
}
}