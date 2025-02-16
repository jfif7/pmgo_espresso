emcc espresso_logic/wasm_bridge.c -o espresso_bin/espresso.js -O2 -sEXPORTED_FUNCTIONS=_run_espresso -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
