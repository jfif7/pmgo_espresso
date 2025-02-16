cmake_minimum_required(VERSION 3.14)

project(pmgo_espresso VERSION 0.1)

include(ExternalProject)

ExternalProject_Add(espresso
  SOURCE_DIR ${CMAKE_SOURCE_DIR}/espresso_logic
  BINARY_DIR ${CMAKE_BINARY_DIR}/espresso
  CMAKE_CACHE_ARGS
    -DCMAKE_TOOLCHAIN_FILE:FILEPATH=$ENV{EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake
  INSTALL_COMMAND ""
  )

ExternalProject_Add(espresso_test
  SOURCE_DIR ${CMAKE_SOURCE_DIR}/espresso_logic/test
  BINARY_DIR ${CMAKE_BINARY_DIR}/test
  INSTALL_COMMAND ""
  )