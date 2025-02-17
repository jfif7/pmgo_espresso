#ifndef CVRIN_STREAM_H
#define CVRIN_STREAM_H

#include "espresso.h"
#include <istream>
#include <ostream>

void skip_line(std::istream& is, std::ostream& out, bool echo);

std::string get_word(std::istream& is);

void read_cube(std::istream& is, pPLA PLA);

void parse_pla(std::istream& is, pPLA PLA);

int read_pla(std::istream& is, int needs_dcset, int needs_offset, int pla_type,
             pPLA* PLA_return);

int read_symbolic(std::istream& is, pPLA PLA, std::string& word,
                  symbolic_t** retval);
int label_index(pPLA PLA, const std::string& word, int* varp, int* ip);

#endif  // CVRIN_STREAM_H
