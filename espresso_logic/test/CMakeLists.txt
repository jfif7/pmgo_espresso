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

add_executable(
    cvrin_steam_test
    cvrin_steam_test.cpp
)
target_link_libraries(
    cvrin_steam_test
    GTest::gtest_main
)

include(GoogleTest)
gtest_discover_tests(cvrin_steam_test)