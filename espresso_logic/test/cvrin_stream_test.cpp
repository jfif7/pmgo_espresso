#include <gtest/gtest.h>
#include "cvrin_stream.cpp"
#include <sstream>

// Demonstrate some basic assertions.
TEST(HelloTest, BasicAssertions) {
    // Expect two strings not to be equal.
    EXPECT_STRNE("hello", "world");
    // Expect equality.
    EXPECT_EQ(7 * 6, 42);
}

TEST(GetWordTest, Basic) {
    std::istringstream ss(" hello world2");

    std::string word1 = get_word(ss);
    std::string word2 = get_word(ss);

    EXPECT_EQ(word1, "hello");
    EXPECT_EQ(word2, "world2");
}

TEST(SkipLineTest, SingleLineWithEcho) {
    std::istringstream input("Hello, world!\n");
    std::ostringstream output;
    skip_line(input, output, true);
    EXPECT_EQ(output.str(), "Hello, world!\n");
}

TEST(SkipLineTest, MultipleLines) {
    std::istringstream input("Line 1\nLine 2\nLine 3\n");
    std::ostringstream output;

    skip_line(input, output, true);
    EXPECT_EQ(output.str(), "Line 1\n");

    skip_line(input, output, true);
    EXPECT_EQ(output.str(), "Line 1\nLine 2\n");

    skip_line(input, output, true);
    EXPECT_EQ(output.str(), "Line 1\nLine 2\nLine 3\n");
}

TEST(SkipLineTest, EmptyLine) {
    std::istringstream input("\nNext line\n");
    std::ostringstream output;

    skip_line(input, output, true);
    EXPECT_EQ(output.str(), "\n");

    skip_line(input, output, true);
    EXPECT_EQ(output.str(), "\nNext line\n");
}

TEST(SkipLineTest, SkipLastLine) {
    std::istringstream input("Last line");
    std::ostringstream output;

    skip_line(input, output, true);
    EXPECT_EQ(output.str(),
              "Last line\n");  // getline doesn't store the newline, but we add
                               // it in the function
}

TEST(SkipLineTest, NoEcho) {
    std::istringstream input("This should not be printed\n");
    std::ostringstream output;

    skip_line(input, output, false);
    EXPECT_EQ(output.str(), "");  // Output should remain empty
}

TEST(ReadPlaTest, BasicFail) {
    std::istringstream input("This should not be printed\n");
    pPLA pla;
    int ret = read_pla(input, true, true, F_type, &pla);
    EXPECT_EQ(ret, EOF);
    std::cerr << pla;
}

TEST(ReadPlaTest, BasicSuccess) {
    std::istringstream input(R""""(
.i 2
.o 2
.p 4
00 10
01 01
11 -1
10 1-
.e
)"""");
    pPLA pla;
    int ret = read_pla(input, true, true, F_type, &pla);
    EXPECT_EQ(ret, 1);
    std::cerr << pla;
}