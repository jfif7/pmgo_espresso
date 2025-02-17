#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo ===[1/3] cmake...===
cmake -S . -B build

echo ===[2/3] make...===
cd build && make

echo ===[3/3] ctest...===
cd test && ctest --output-on-failure
