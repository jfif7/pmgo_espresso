#include "mincov_int.h"

solution_t *solution_alloc(void) {
    solution_t *sol;

    sol = ALLOC(solution_t, 1);
    sol->cost = 0;
    sol->row = sm_row_alloc();
    return sol;
}

void solution_free(solution_t *sol) {
    sm_row_free(sol->row);
    FREE(sol);
}

solution_t *solution_dup(solution_t *sol) {
    solution_t *new_sol;

    new_sol = ALLOC(solution_t, 1);
    new_sol->cost = sol->cost;
    new_sol->row = sm_row_dup(sol->row);
    return new_sol;
}

void solution_add(solution_t *sol, int *weight, int col) {
    (void)sm_row_insert(sol->row, col);
    sol->cost += WEIGHT(weight, col);
}

void solution_accept(solution_t *sol, sm_matrix *A, int *weight, int col) {
    sm_element *p, *pnext;
    sm_col *pcol;

    solution_add(sol, weight, col);

    /* delete rows covered by this column */
    pcol = sm_get_col(A, col);
    for (p = pcol->first_row; p != 0; p = pnext) {
        pnext = p->next_row; /* grab it before it disappears */
        sm_delrow(A, p->row_num);
    }
}

/* ARGSUSED */
void solution_reject(solution_t *sol, sm_matrix *A, int *weight, int col) {
    sm_delcol(A, col);
}

solution_t *solution_choose_best(solution_t *best1, solution_t *best2) {
    if (best1 != NIL(solution_t)) {
        if (best2 != NIL(solution_t)) {
            if (best1->cost <= best2->cost) {
                solution_free(best2);
                return best1;
            } else {
                solution_free(best1);
                return best2;
            }
        } else {
            return best1;
        }
    } else {
        if (best2 != NIL(solution_t)) {
            return best2;
        } else {
            return NIL(solution_t);
        }
    }
}
