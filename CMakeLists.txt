cmake_minimum_required(VERSION 3.14)
# cmake_policy(SET CMP0015 NEW)

project(pmgo_espresso VERSION 0.1)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/espresso_bin)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(espresso  espresso_logic/wasm_bridge.cpp)