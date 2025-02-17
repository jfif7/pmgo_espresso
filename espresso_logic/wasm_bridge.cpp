#if __EMSCRIPTEN__
#include <emscripten.h>
#endif
#include <iostream>
#include <string>
#include <sstream>
#include "espresso.h"
#include "cvrin_stream.hpp"

int espresso_bridge(std::istream &is);

extern "C" {
#if __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
const char *run_espresso(const std::string &input) {
    std::cout << "This is C++!\n" << input << '\n';
    std::istringstream is(input);
    espresso_bridge(is);
    return "what?";
}
}

int espresso_bridge(std::istream &is) {
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

    /* Output the solution */
    // if (print_solution) {
    //     EXECUTE(fprint_pla(stdout, PLA, out_type), WRITE_TIME, PLA->F, cost);
    // }

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

    return 0;
}