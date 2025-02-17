/*
    module: cvrin_steam.cpp
    purpose: cube and cover input routines with std::iostream
*/

#include <string>
#include <istream>
#include "espresso.h"
#include "cvrin_stream.hpp"
#include <iostream>
#include <sstream>
#include <vector>
#include <cctype>
#include <cstdlib>

static bool line_length_error;
static int lineno;

void skip_line(std::istream& is, std::ostream& out, bool echo) {
    std::string line;
    if (std::getline(is, line) && echo) {
        out << line << '\n';
    }
}

std::string get_word(std::istream& is) {
    std::string word;
    is >> word;
    return is ? word : "";  // Ensure the same EOF handling as the original
}

void read_cube(std::istream& is, pPLA PLA) {
    int var, i;
    pcube cf = cube.temp[0], cr = cube.temp[1], cd = cube.temp[2];
    bool savef = false, saved = false, saver = false;
    std::string token;
    int varx, first, last, offset;

    set_clear(cf, cube.size);

    // Loop and read binary variables
    for (var = 0; var < cube.num_binary_vars; var++) {
        char ch;
        if (!(is >> std::ws).get(ch)) goto bad_char;

        switch (ch) {
            case '\n':
                if (!line_length_error)
                    std::cerr << "product term(s) span more than one line "
                                 "(warning only)\n";
                line_length_error = true;
                lineno++;
                var--;
                break;
            case ' ':
            case '|':
            case '\t':
                var--;
                break;
            case '2':
            case '-':
                set_insert(cf, var * 2 + 1);
            case '0':
                set_insert(cf, var * 2);
                break;
            case '1':
                set_insert(cf, var * 2 + 1);
                break;
            case '?':
                break;
            default:
                goto bad_char;
        }
    }

    // Loop for all but one of the multiple-valued variables
    for (var = cube.num_binary_vars; var < cube.num_vars - 1; var++) {
        if (cube.part_size[var] < 0) {
            if (!(is >> token)) goto bad_char;

            if (token == "-" || token == "ANY") {
                if (kiss && var == cube.num_vars - 2) {
                    // leave it empty
                } else {
                    set_or(cf, cf, cube.var_mask[var]);
                }
            } else if (token == "~") {
                // leave it empty
            } else {
                if (kiss && var == cube.num_vars - 2)
                    varx = var - 1, offset = std::abs(cube.part_size[var - 1]);
                else
                    varx = var, offset = 0;

                first = cube.first_part[varx];
                last = cube.last_part[varx];

                for (i = first; i <= last; i++) {
                    if (PLA->label[i] == nullptr) {
                        PLA->label[i] = strdup(token.c_str());
                        set_insert(cf, i + offset);
                        break;
                    } else if (token == PLA->label[i]) {
                        set_insert(cf, i + offset);
                        break;
                    }
                }

                if (i > last) {
                    std::cerr << "declared size of variable " << var
                              << " (counting from variable 0) is too small\n";
                    exit(-1);
                }
            }
        } else {
            for (i = cube.first_part[var]; i <= cube.last_part[var]; i++) {
                char ch;
                if (!(is >> std::ws).get(ch)) goto bad_char;

                switch (ch) {
                    case '\n':
                        if (!line_length_error)
                            std::cerr << "product term(s) span more than one "
                                         "line (warning only)\n";
                        line_length_error = true;
                        lineno++;
                        i--;
                        break;
                    case ' ':
                    case '|':
                    case '\t':
                        i--;
                        break;
                    case '1':
                        set_insert(cf, i);
                    case '0':
                        break;
                    default:
                        goto bad_char;
                }
            }
        }
    }

    // Last multiple-valued variable
    if (kiss) {
        saver = savef = true;
        set_xor(cr, cf, cube.var_mask[cube.num_vars - 2]);
    } else {
        set_copy(cr, cf);
    }

    set_copy(cd, cf);

    for (i = cube.first_part[var]; i <= cube.last_part[var]; i++) {
        char ch;
        if (!(is >> std::ws).get(ch)) goto bad_char;

        switch (ch) {
            case '\n':
                if (!line_length_error)
                    std::cerr << "product term(s) span more than one line "
                                 "(warning only)\n";
                line_length_error = true;
                lineno++;
                i--;
                break;
            case ' ':
            case '|':
            case '\t':
                i--;
                break;
            case '4':
            case '1':
                if (PLA->pla_type & F_type) set_insert(cf, i), savef = true;
                break;
            case '3':
            case '0':
                if (PLA->pla_type & R_type) set_insert(cr, i), saver = true;
                break;
            case '2':
            case '-':
                if (PLA->pla_type & D_type) set_insert(cd, i), saved = true;
            case '~':
                break;
            default:
                goto bad_char;
        }
    }

    if (savef) PLA->F = sf_addset(PLA->F, cf);
    if (saved) PLA->D = sf_addset(PLA->D, cd);
    if (saver) PLA->R = sf_addset(PLA->R, cr);
    return;

bad_char:
    std::cerr << "(warning): input line #" << lineno << " ignored\n";
    skip_line(is, std::cout, true);
    return;
}

void parse_pla(std::istream& is, pPLA PLA) {
    int i, var, np, last;
    std::string word;
    char ch;

    lineno = 1;
    line_length_error = false;
    while (is) {
        ch = is.get();

        switch (ch) {
            case EOF:
                return;
            case '\n':
                lineno++;
            case ' ':
            case '\t':
            case '\f':
            case '\r':
                break;
            case '#':
                is.unget();
                skip_line(is, std::cout, echo_comments);
                break;
            case '.':
                word = get_word(is);
                /* .i gives the cube input size (binary-functions only) */
                if (word == "i") {
                    if (cube.fullset != nullptr) {
                        std::cerr << "extra .i ignored\n";
                        skip_line(is, std::cout, /* echo */ false);
                    } else {
                        if (!(is >> cube.num_binary_vars)) {
                            throw std::runtime_error("error reading .i");
                        }

                        cube.num_vars = cube.num_binary_vars + 1;
                        cube.part_size = ALLOC(int, cube.num_vars);
                    }
                    /* .o gives the cube output size (binary-functions only) */
                } else if (word == "o") {
                    if (cube.fullset != nullptr) {
                        std::cerr << "extra .o ignored\n";
                        skip_line(is, std::cout, /* echo */ false);
                    } else {
                        if (cube.part_size == nullptr)
                            throw std::runtime_error(
                                ".o cannot appear before .i");

                        if (!(is >> cube.part_size[cube.num_vars - 1]))
                            throw std::runtime_error("error reading .o");

                        cube_setup();
                        PLA_labels(PLA);
                    }
                    /* .mv gives the cube size for a multiple-valued function */
                } else if (word == "mv") {
                    if (cube.fullset != nullptr) {
                        std::cerr << "extra .mv ignored\n";
                        skip_line(is, std::cout, /* echo */ false);
                    } else {
                        if (cube.part_size != nullptr)
                            throw std::runtime_error("cannot mix .i and .mv");

                        if (!(is >> cube.num_vars >> cube.num_binary_vars))
                            throw std::runtime_error("error reading .mv");

                        if (cube.num_binary_vars < 0)
                            throw std::runtime_error(
                                "num_binary_vars (second field of .mv) cannot "
                                "be negative");

                        if (cube.num_vars < cube.num_binary_vars)
                            throw std::runtime_error(
                                "num_vars (1st field of .mv) must exceed "
                                "num_binary_vars (2nd field of .mv)");

                        cube.part_size = new int[cube.num_vars];

                        for (var = cube.num_binary_vars; var < cube.num_vars;
                             var++)
                            if (!(is >> cube.part_size[var]))
                                throw std::runtime_error("error reading .mv");

                        cube_setup();
                        PLA_labels(PLA);
                    }
                    /* .p gives the number of product terms -- we ignore it */
                } else if (word == "p") {
                    is >> np;
                    /* .e and .end specify the end of the file */
                } else if (word == "e" || word == "end") {
                    return;
                    /* .kiss turns on the kiss-hack option */
                } else if (word == "kiss") {
                    kiss = true;
                    /* .type specifies a logical type for the PLA */
                } else if (word == "type") {
                    std::string type_word = get_word(is);
                    for (i = 0; pla_types[i].key != nullptr; i++) {
                        if (str_equal(pla_types[i].key + 1,
                                      type_word.c_str())) {
                            PLA->pla_type = pla_types[i].value;
                            break;
                        }
                    }
                    if (pla_types[i].key == 0) {
                        throw std::runtime_error(
                            "unknown type in .type command");
                    }
                    /* parse the labels */
                } else if (word == "ilb") {
                    if (cube.fullset == NULL) {
                        throw std::runtime_error(
                            "PLA size must be declared before .ilb or .ob");
                    }

                    if (PLA->label == NULL) PLA_labels(PLA);

                    for (var = 0; var < cube.num_binary_vars; var++) {
                        word = get_word(is);
                        i = cube.first_part[var];
                        PLA->label[i + 1] = strdup(word.c_str());
                        PLA->label[i] = ALLOC(char, word.length() + 6);
                        (void)sprintf(PLA->label[i], "%s.bar", word.c_str());
                    }
                } else if (word == "ob") {
                    if (cube.fullset == NULL) {
                        throw std::runtime_error(
                            "PLA size must be declared before .ilb or .ob");
                    }

                    if (PLA->label == NULL) PLA_labels(PLA);

                    var = cube.num_vars - 1;
                    for (i = cube.first_part[var]; i <= cube.last_part[var];
                         i++) {
                        word = get_word(is);
                        PLA->label[i] = strdup(word.c_str());
                    }
                    /* .label assigns labels to multiple-valued variables */
                } else if (word == "label") {
                    if (cube.fullset == NULL) {
                        throw std::runtime_error(
                            "PLA size must be declared before .label");
                    }

                    if (PLA->label == NULL) PLA_labels(PLA);

                    // skip "var=" part of input
                    char tmp;
                    if (!(is >> std::ws >> tmp >> tmp >> tmp >> tmp >> var)) {
                        throw std::runtime_error("Error reading labels");
                    }

                    for (i = cube.first_part[var]; i <= cube.last_part[var];
                         i++) {
                        word = get_word(is);
                        PLA->label[i] = strdup(word.c_str());
                    }
                } else if (word == "symbolic") {
                    symbolic_t *newlist, *p1;

                    if (read_symbolic(is, PLA, word, &newlist)) {
                        if (PLA->symbolic == NIL(symbolic_t)) {
                            PLA->symbolic = newlist;
                        } else {
                            for (p1 = PLA->symbolic;
                                 p1->next != NIL(symbolic_t); p1 = p1->next);
                            p1->next = newlist;
                        }
                    } else {
                        throw std::runtime_error("error reading .symbolic");
                    }
                } else if (word == "symbolic-output") {
                    symbolic_t *newlist, *p1;

                    if (read_symbolic(is, PLA, word, &newlist)) {
                        if (PLA->symbolic_output == NIL(symbolic_t)) {
                            PLA->symbolic_output = newlist;
                        } else {
                            for (p1 = PLA->symbolic_output;
                                 p1->next != NIL(symbolic_t); p1 = p1->next);
                            p1->next = newlist;
                        }
                    } else {
                        throw std::runtime_error(
                            "error reading .symbolic-output");
                    }
                    /* .phase allows a choice of output phases */
                } else if (word == "phase") {
                    if (cube.fullset == NULL)
                        throw std::runtime_error(
                            "PLA size must be declared before .phase");

                    if (PLA->phase != NULL) {
                        fprintf(stderr, "extra .phase ignored\n");
                        skip_line(is, std::cout, /* echo */ FALSE);
                    } else {
                        do ch = is.get();
                        while (ch == ' ' || ch == '\t');
                        is.unget();
                        PLA->phase = set_save(cube.fullset);
                        last = cube.last_part[cube.num_vars - 1];

                        for (i = cube.first_part[cube.num_vars - 1]; i <= last;
                             i++)
                            if ((ch = is.get()) == '0')
                                set_remove(PLA->phase, i);
                            else if (ch != '1')
                                throw std::runtime_error(
                                    "only 0 or 1 allowed in phase description");
                    }
                    /* .pair allows for bit-pairing input variables */
                } else if (word == "pair") {
                    int j;

                    if (PLA->pair != NULL) {
                        fprintf(stderr, "extra .pair ignored\n");
                    } else {
                        ppair pair;
                        PLA->pair = pair = ALLOC(pair_t, 1);

                        if (!(is >> pair->cnt))
                            throw std::runtime_error("syntax error in .pair");

                        pair->var1 = ALLOC(int, pair->cnt);
                        pair->var2 = ALLOC(int, pair->cnt);

                        for (i = 0; i < pair->cnt; i++) {
                            word = get_word(is);

                            if (word[0] == '(') {
                                word.erase(0, 1);
                            }

                            if (label_index(PLA, word, &var, &j)) {
                                pair->var1[i] = var + 1;
                            } else {
                                throw std::runtime_error(
                                    "syntax error in .pair");
                            }

                            word = get_word(is);

                            if (word.back() == ')') {
                                word.pop_back();
                            }

                            if (label_index(PLA, word, &var, &j)) {
                                pair->var2[i] = var + 1;
                            } else {
                                throw std::runtime_error(
                                    "syntax error in .pair");
                            }
                        }
                    }
                } else {
                    if (echo_unknown_commands) std::cout << ch << word << " ";
                    skip_line(is, std::cout, echo_unknown_commands);
                }
                break;
            default:
                is.unget();
                if (cube.fullset == nullptr) {
                    if (echo_comments) std::cout << '#';
                    skip_line(is, std::cout, echo_comments);
                    break;
                }

                if (PLA->F == nullptr) {
                    PLA->F = new_cover(10);
                    PLA->D = new_cover(10);
                    PLA->R = new_cover(10);
                }

                read_cube(is, PLA);
        }
    }
}

/*
    read_pla -- read a PLA from a file

    Input stops when ".e" is encountered in the input file, or upon reaching
    end of file.

    Returns the PLA in the variable PLA after massaging the "symbolic"
    representation into a positional cube notation of the ON-set, OFF-set,
    and the DC-set.

    needs_dcset and needs_offset control the computation of the OFF-set
    and DC-set (i.e., if either needs to be computed, then it will be
    computed via complement only if the corresponding option is TRUE.)
    pla_type specifies the interpretation to be used when reading the
    PLA.

    The phase of the output functions is adjusted according to the
    global option "pos" or according to an imbedded .phase option in
    the input file.  Note that either phase option implies that the
    OFF-set be computed regardless of whether the caller needs it
    explicitly or not.

    Bit pairing of the binary variables is performed according to an
    imbedded .pair option in the input file.

    The global cube structure also reflects the sizes of the PLA which
    was just read.  If these fields have already been set, then any
    subsequent PLA must conform to these sizes.

    The global flags trace and summary control the output produced
    during the read.

    Returns a status code as a result:
  EOF (-1) : End of file reached before any data was read
  > 0	 : Operation successful
*/

int read_pla(std::istream& is, int needs_dcset, int needs_offset, int pla_type,
             pPLA* PLA_return) {
    pPLA PLA;
    int i, second, third;
    long time;
    cost_t cost;

    /* Allocate and initialize the PLA structure */
    PLA = *PLA_return = new_PLA();
    PLA->pla_type = pla_type;

    /* Read the pla */
    time = ptime();
    parse_pla(is, PLA);

    /* Check for nothing on the file -- implies reached EOF */
    if (PLA->F == NULL) {
        return EOF;
    }

    /* This hack merges the next-state field with the outputs */
    for (i = 0; i < cube.num_vars; i++) {
        cube.part_size[i] = ABS(cube.part_size[i]);
    }

    if (kiss) {
        third = cube.num_vars - 3;
        second = cube.num_vars - 2;

        if (cube.part_size[third] != cube.part_size[second]) {
            fprintf(stderr, " with .kiss option, third to last and second\n");
            fprintf(stderr, "to last variables must be the same size.\n");
            std::cerr << "what??\n";
            return EOF;
        }

        for (i = 0; i < cube.part_size[second]; i++) {
            PLA->label[i + cube.first_part[second]] =
                strdup(PLA->label[i + cube.first_part[third]]);
        }

        cube.part_size[second] += cube.part_size[cube.num_vars - 1];
        cube.num_vars--;
        setdown_cube();
        cube_setup();
    }

    /* Decide how to break PLA into ON-set, OFF-set and DC-set */
    time = ptime();
    if (pos || PLA->phase != NULL || PLA->symbolic_output != NIL(symbolic_t)) {
        needs_offset = TRUE;
    }

    if (needs_offset && (PLA->pla_type == F_type || PLA->pla_type == FD_type)) {
        free_cover(PLA->R);
        PLA->R = complement(cube2list(PLA->F, PLA->D));
    } else if (needs_dcset && PLA->pla_type == FR_type) {
        pcover X;
        free_cover(PLA->D);

        /* hack, why not? */
        X = d1merge(sf_join(PLA->F, PLA->R), cube.num_vars - 1);
        PLA->D = complement(cube1list(X));
        free_cover(X);
    } else if (PLA->pla_type == R_type || PLA->pla_type == DR_type) {
        free_cover(PLA->F);
        PLA->F = complement(cube2list(PLA->D, PLA->R));
    }

    /* Check for phase rearrangement of the functions */
    if (pos) {
        pcover onset = PLA->F;
        PLA->F = PLA->R;
        PLA->R = onset;
        PLA->phase = new_cube();
        set_diff(PLA->phase, cube.fullset, cube.var_mask[cube.num_vars - 1]);
    } else if (PLA->phase != NULL) {
        (void)set_phase(PLA);
    }

    /* Setup minimization for two-bit decoders */
    if (PLA->pair != (ppair)NULL) {
        set_pair(PLA);
    }

    if (PLA->symbolic != NIL(symbolic_t)) {
        EXEC(map_symbolic(PLA), "MAP-INPUT  ", PLA->F);
    }

    if (PLA->symbolic_output != NIL(symbolic_t)) {
        EXEC(map_output_symbolic(PLA), "MAP-OUTPUT ", PLA->F);

        if (needs_offset) {
            free_cover(PLA->R);
            EXECUTE(PLA->R = complement(cube2list(PLA->F, PLA->D)), COMPL_TIME,
                    PLA->R, cost);
        }
    }

    return 1;
}

int read_symbolic(std::istream& is, pPLA PLA, std::string& word,
                  symbolic_t** retval) {
    symbolic_list_t *listp, *prev_listp;
    symbolic_label_t *labelp, *prev_labelp;
    symbolic_t* newlist;
    int i, var;

    newlist = ALLOC(symbolic_t, 1);
    newlist->next = NIL(symbolic_t);
    newlist->symbolic_list = NIL(symbolic_list_t);
    newlist->symbolic_list_length = 0;
    newlist->symbolic_label = NIL(symbolic_label_t);
    newlist->symbolic_label_length = 0;
    prev_listp = NIL(symbolic_list_t);
    prev_labelp = NIL(symbolic_label_t);

    for (;;) {
        word = get_word(is);
        if (word == ";") break;
        if (label_index(PLA, word, &var, &i)) {
            listp = ALLOC(symbolic_list_t, 1);
            listp->variable = var;
            listp->pos = i;
            listp->next = NIL(symbolic_list_t);
            if (prev_listp == NIL(symbolic_list_t)) {
                newlist->symbolic_list = listp;
            } else {
                prev_listp->next = listp;
            }
            prev_listp = listp;
            newlist->symbolic_list_length++;
        } else {
            return FALSE;
        }
    }

    for (;;) {
        word = get_word(is);
        if (word == ";") break;
        labelp = ALLOC(symbolic_label_t, 1);
        labelp->label = strdup(word.c_str());
        labelp->next = NIL(symbolic_label_t);
        if (prev_labelp == NIL(symbolic_label_t)) {
            newlist->symbolic_label = labelp;
        } else {
            prev_labelp->next = labelp;
        }
        prev_labelp = labelp;
        newlist->symbolic_label_length++;
    }

    *retval = newlist;
    return TRUE;
}

int label_index(pPLA PLA, const std::string& word, int* varp, int* ip) {
    if (PLA->label == nullptr || PLA->label[0] == nullptr) {
        // Try to parse the word as an integer if label is not defined
        std::istringstream iss(word);
        if (iss >> *varp) {
            *ip = *varp;
            return true;
        }
    } else {
        for (int var = 0; var < cube.num_vars; ++var) {
            for (int i = 0; i < cube.part_size[var]; ++i) {
                if (PLA->label[cube.first_part[var] + i] == word) {
                    *varp = var;
                    *ip = i;
                    return true;
                }
            }
        }
    }
    return false;
}
