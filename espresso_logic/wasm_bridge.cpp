#if __EMSCRIPTEN__
#include <emscripten.h>
#endif
#include <iostream>
#include <string>
#include <cstring>
#include <sstream>
#include "espresso.h"
#include "cvrin_stream.hpp"

char *espresso_bridge(std::istream &);
const std::string get_solution(pPLA);

extern "C" {
#if __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
char *run_espresso(const char *input_char) {
    std::cout << "This is C++!\n" << std::endl;
    std::istringstream is(input_char);
    char *solution = espresso_bridge(is);
    return solution;
}
}

char *espresso_bridge(std::istream &is) {
    int i, j, first, last, strategy, out_type, option;
    pPLA PLA;
    pcover F, Fold, Dold;
    pset last1, p;
    cost_t cost;
    bool error, exact_cover;
    extern char *optarg;
    extern int optind;

    error = FALSE;

    option = 0;            /* default -D: ESPRESSO */
    out_type = F_type;     /* default -o: default is ON-set only */
    debug = 0;             /* default -d: no debugging info */
    verbose_debug = FALSE; /* default -v: not verbose */
    print_solution = TRUE; /* default -x: print the solution (!) */
    summary = FALSE;       /* default -s: no summary */
    trace = FALSE;         /* default -t: no trace information */
    strategy = 0;          /* default -S: strategy number */
    first = -1;            /* default -R: select range */
    last = -1;
    remove_essential = TRUE; /* default -e: */
    force_irredundant = TRUE;
    unwrap_onset = TRUE;
    single_expand = FALSE;
    pos = FALSE;
    recompute_onset = FALSE;
    use_super_gasp = FALSE;
    use_random_order = FALSE;
    kiss = FALSE;
    echo_comments = TRUE;
    echo_unknown_commands = TRUE;
    exact_cover = FALSE; /* for -qm option, the default */

    if (read_pla(is, TRUE, TRUE, F_type, &PLA) == EOF) {
        fprintf(stderr, "Unable to find PLA on string\n");
        exit(1);
    }

    Fold = sf_save(PLA->F);
    PLA->F = espresso(PLA->F, PLA->D, PLA->R);
    EXECUTE(error = verify(PLA->F, Fold, PLA->D), VERIFY_TIME, PLA->F, cost);
    if (error) {
        print_solution = FALSE;
        PLA->F = Fold;
        (void)check_consistency(PLA);
    } else {
        free_cover(Fold);
    }

    const std::string &solution = get_solution(PLA);
    std::cout << solution << std::endl;

    /* Crash and burn if there was a verify error */
    if (error) {
        throw std::runtime_error("cover verification failed");
    }

    /* cleanup all used memory */
    free_PLA(PLA);
    FREE(cube.part_size);
    setdown_cube(); /* free the cube/cdata structure data */
    sf_cleanup();   /* free unused set structures */
    sm_cleanup();   /* sparse matrix cleanup */

    char *cstr = new char[solution.size() + 1];
    std::strcpy(cstr, solution.c_str());

    return cstr;
}

const std::string get_solution(pPLA PLA) {
    std::string solution;
    pcube last, p;

    foreach_set(PLA->F, last, p) {
        for (int var = 0; var < cube.num_binary_vars; var++) {
            solution.push_back("?01-"[GETINPUT(p, var)]);
        }

        for (int var = cube.num_binary_vars; var < cube.num_vars - 1; var++) {
            solution.push_back(' ');
            for (int i = cube.first_part[var]; i <= cube.last_part[var]; i++) {
                solution.push_back("01"[is_in_set(p, i) != 0]);
            }
        }

        if (cube.output != -1) {
            int last_part = cube.last_part[cube.output];
            solution.push_back(' ');

            for (int i = cube.first_part[cube.output]; i <= last_part; i++) {
                solution.push_back("01"[is_in_set(p, i) != 0]);
            }
        }

        solution.push_back('\n');
    }
    return solution;
}