cmake_minimum_required(VERSION 3.14)
project(espresso_test)

# GoogleTest requires at least C++14
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
option(INSTALL_GTEST OFF)
FetchContent_MakeAvailable(googletest)

enable_testing()

file(GLOB SRC_FILES "${PROJECT_SOURCE_DIR}/../*.c")
add_library(ESPRESSO STATIC ${SRC_FILES})

add_executable(
    cvrin_stream_test
    cvrin_stream_test.cpp
)

target_link_libraries(
    cvrin_stream_test PUBLIC
    GTest::gtest_main
    ESPRESSO
)

target_include_directories(
    cvrin_stream_test PUBLIC
    ${PROJECT_SOURCE_DIR}/..
)

include(GoogleTest)
gtest_discover_tests(cvrin_stream_test)