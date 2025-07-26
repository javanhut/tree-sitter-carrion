# tree-sitter-carrion

Tree-sitter grammar for the Carrion programming language.

## About

This grammar provides syntax highlighting and parsing support for Carrion language files (`.crl`) in editors that support Tree-sitter, including VS Code, Neovim, and others.

## Building

```bash
# Install dependencies
npm install

# Generate parser
npm run build

# Run tests
npm run test
```

## Testing

The grammar includes test cases in `test/corpus/` covering:
- Functions (`spell` keyword)
- Classes (`grim` keyword) 
- Control flow (`if`/`elif`/`else`, `for`, `while`)
- Error handling (`attempt`/`ensnare`/`resolve`)
- Print statements
- Comments
- Variables and operators

## Carrion Language Features

This grammar supports the core Carrion syntax including:

- **Functions**: `spell functionName():`
- **Classes**: `grim ClassName:`
- **Control flow**: `if`/`elif`/`else`, `for`/`while` loops
- **Error handling**: `attempt`/`ensnare`/`resolve` (try/catch/finally)
- **Loop control**: `skip` (continue), `stop` (break)
- **Comments**: `# single line comments`
- **Data types**: strings, integers, floats, lists, dictionaries
- **Print statements**: `print "hello"` (no parentheses required)

## Installation

### Prerequisites

- Node.js and npm
- C/C++ compiler (for building the parser)
- Tree-sitter CLI: `npm install -g tree-sitter-cli`

### Building the Parser

```bash
git clone <repository-url>
cd tree-sitter-carrion
npm install
npm run build
```

### Editor Integration

#### VS Code

1. Install the Tree-sitter extension
2. Copy `src/` directory to your Tree-sitter parsers directory
3. Add to your VS Code settings:
```json
{
  "tree-sitter.parsers": {
    "carrion": "/path/to/tree-sitter-carrion"
  },
  "files.associations": {
    "*.crl": "carrion"
  }
}
```

#### Neovim (with nvim-treesitter)

##### Mason Installation

For Mason, add to your Mason setup:
```lua
require("mason").setup({
  ensure_installed = {
    "tree-sitter-carrion"  -- If available in Mason registry
  }
})
```

##### Lazy.nvim Installation

For Lazy.nvim, add this to your plugin configuration:
```lua
{
  "nvim-treesitter/nvim-treesitter",
  build = ":TSUpdate",
  config = function()
    require("nvim-treesitter.configs").setup({
      ensure_installed = { "carrion" },
      highlight = { enable = true },
      indent = { enable = true },
    })
  end,
}
```

##### Manual Installation (Recommended for Custom Grammar)

Since this is a custom tree-sitter grammar, manual installation is most reliable:

1. Clone and build the parser:
```bash
cd ~/.local/share/nvim/site/pack/packer/start/nvim-treesitter
mkdir -p parsers
cd /path/to/tree-sitter-carrion
npm run build
cp src/parser.c ~/.local/share/nvim/site/pack/packer/start/nvim-treesitter/parsers/carrion.c
```

2. Add parser configuration to your Neovim config:
```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.carrion = {
  install_info = {
    url = "/path/to/tree-sitter-carrion",
    files = {"src/parser.c", "src/scanner.c"},
    branch = "main",
  },
  filetype = "carrion",
}

require("nvim-treesitter.configs").setup({
  ensure_installed = { "carrion" },
  highlight = { enable = true },
  indent = { enable = true },
})
```

3. Set up file association:
```lua
vim.filetype.add({
  extension = {
    crl = "carrion",
  },
})
```

#### Manual Installation

Copy the generated files from `src/` to your Tree-sitter parsers directory:
- `parser.c` - The generated parser
- `tree_sitter/parser.h` - Header file
- `grammar.json` - Grammar definition
- `node-types.json` - Node type definitions

## Contributing

When modifying the grammar, ensure it accurately reflects the actual Carrion language implementation. Test changes with real Carrion code examples.