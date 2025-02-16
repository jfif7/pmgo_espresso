ESPRESSO_SRC := $(wildcard espresso_logic/*)
ESPRESSO_OUT := espresso_bin/espresso.js

all: $(ESPRESSO_OUT)

$(ESPRESSO_OUT): $(ESPRESSO_SRC)
	@mkdir -p espresso_bin
	emcc espresso_logic/wasm_bridge.cpp -o $(ESPRESSO_OUT) -O2 \
	    -sEXPORTED_FUNCTIONS=_run_espresso \
	    -sEXPORTED_RUNTIME_METHODS=ccall,cwrap

clean:
	rm -rf espresso_bin/*
