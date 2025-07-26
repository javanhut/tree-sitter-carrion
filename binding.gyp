{
  "targets": [
    {
      "target_name": "tree_sitter_carrion_binding",
      "sources": [
        "src/parser.c",
        "src/scanner.c"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
