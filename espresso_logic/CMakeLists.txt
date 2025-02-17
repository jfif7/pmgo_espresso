cmake_minimum_required(VERSION 3.14)

project(espresso)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/../espresso_bin)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

file(GLOB SOURCES
    wasm_bridge.cpp
    globals.c
    cvrin_stream.cpp
    cvrin.c
    cubestr.c
    set.c
    setc.c
    cvrmisc.c
    cpu_time.c
    cofactor.c
    compl.c
    cvrout.c
    contain.c
    unate.c
    verify.c
    sharp.c
    opo.c
    irred.c
    prtime.c
    pair.c
    hack.c
    cvrm.c
    matrix.c
    espresso.c
    expand.c
    rows.c
    cols.c
    reduce.c
    sminterf.c
    essen.c
    gasp.c
    sparse.c
    dominate.c
    mincov.c
    solution.c
    gimpel.c
    part.c
    indep.c
)
list(FILTER SOURCES EXCLUDE REGEX ".*/main\\.c$")
# add_library(espresso_lib STATIC )

add_executable(wasm_bridge ${SOURCES})
set_target_properties(wasm_bridge PROPERTIES LINK_FLAGS
    "-s EXPORTED_FUNCTIONS=['_run_espresso','_allocate_cpp','_free_cpp'] -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','stringToUTF8','UTF8ToString']")


# target_link_libraries(wasm_bridge PRIVATE espresso_lib)
