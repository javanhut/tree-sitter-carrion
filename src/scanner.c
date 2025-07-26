#include "tree_sitter/parser.h"

enum TokenType {
  NEWLINE,
  INDENT,
  DEDENT,
};

void *tree_sitter_carrion_external_scanner_create() { return NULL; }
void tree_sitter_carrion_external_scanner_destroy(void *p) {}
unsigned tree_sitter_carrion_external_scanner_serialize(void *p, char *b) { return 0; }
void tree_sitter_carrion_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

bool tree_sitter_carrion_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    if (valid_symbols[NEWLINE]) {
        // Handle newlines
    }
    if (valid_symbols[INDENT]) {
        // Handle indents
    }
    if (valid_symbols[DEDENT]) {
        // Handle dedents
    }
    return false;
}
