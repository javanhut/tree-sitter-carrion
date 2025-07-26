const PREC = {
    assign: -1,
    or: 10,
    and: 11,
    not: 12,
    compare: 13,
    plus: 14,
    times: 15,
    power: 16,
    unary: 17,
    call: 18,
  };
  
  module.exports = grammar({
    name: 'carrion',
  
    extras: $ => [
      $.comment,
      /\s|\r/,
    ],
  
    supertypes: $ => [
      $._expression,
      $._primary_expression,
    ],
  
    externals: $ => [
      $._newline,
      $._indent,
      $._dedent,
    ],
  
    inline: $ => [
      $.keyword_identifier,
    ],
  
    rules: {
      source_file: $ => seq(repeat($.statement), optional($._newline)),

      statement: $ => choice(
        $.simple_statement,
        $.compound_statement
      ),

      simple_statement: $ => seq(
        choice(
          $.expression_statement,
          $.import_statement,
          $.return_statement,
          $.pass,
          $.break_statement,
          $.continue_statement,
          $.print_statement
        ),
        choice($._newline, ';')
      ),

      compound_statement: $ => choice(
        $.if_statement,
        $.for_statement,
        $.while_statement,
        $.function_definition,
        $.class_definition,
        $.try_statement
      ),

      expression_statement: $ => choice(
        $._expression,
        $.assignment,
        $.augmented_assignment
      ),

      import_statement: $ => seq(
        'import',
        $._import_list,
        optional(seq('as', $.identifier))
      ),

      _import_list: $ => seq($.dotted_name, repeat(seq(',', $.dotted_name))),

      return_statement: $ => seq('return', optional($._expression)),

      pass: $ => prec.left('pass'),
      break_statement: $ => prec.left('stop'),
      continue_statement: $ => prec.left('skip'),

      print_statement: $ => seq('print', optional($._expression_list)),

      if_statement: $ => seq(
        'if',
        $._expression,
        ':',
        $._suite,
        repeat($.elif_clause),
        optional($.else_clause)
      ),

      elif_clause: $ => seq(
        'elif',
        $._expression,
        ':',
        $._suite
      ),

      else_clause: $ => seq(
        'else',
        ':',
        $._suite
      ),

      for_statement: $ => seq(
        'for',
        $.identifier,
        'in',
        $._expression,
        ':',
        $._suite
      ),

      while_statement: $ => seq(
        'while',
        $._expression,
        ':',
        $._suite
      ),

      function_definition: $ => seq(
        'spell',
        $.identifier,
        $.parameters,
        ':',
        $._suite
      ),

      class_definition: $ => seq(
        'grim',
        $.identifier,
        optional($._class_heritage),
        ':',
        $._suite
      ),

      _class_heritage: $ => seq('(', $.identifier, ')'),

      try_statement: $ => seq(
        'attempt',
        ':',
        $._suite,
        repeat($.except_clause),
        optional($.else_clause),
        optional($.finally_clause)
      ),

      except_clause: $ => seq(
        'ensnare',
        optional($._expression),
        optional(seq('as', $.identifier)),
        ':',
        $._suite
      ),

      finally_clause: $ => seq(
        'resolve',
        ':',
        $._suite
      ),

      _suite: $ => choice(
        $.simple_statement,
        seq($._indent, repeat($.statement), $._dedent)
      ),

      _expression_list: $ => seq($._expression, repeat(seq(',', $._expression))),

      _expression: $ => choice(
        $.comparison_operator,
        $._primary_expression,
        $.boolean_operator,
        $.binary_operator,
        $.unary_operator
      ),

      _primary_expression: $ => choice(
        $.identifier,
        $.string,
        $.integer,
        $.float,
        $.true,
        $.false,
        $.none,
        $.list,
        $.dictionary,
        $.call_expression
      ),

      call_expression: $ => prec(PREC.call, seq(
        $._primary_expression,
        '(',
        optional($._argument_list),
        ')'
      )),

      _argument_list: $ => seq($._expression, repeat(seq(',', $._expression))),

      list: $ => seq('[', optional($._expression_list), ']'),
      dictionary: $ => seq('{', optional($._key_value_pair_list), '}'),
      _key_value_pair_list: $ => seq($.key_value_pair, repeat(seq(',', $.key_value_pair))),
      key_value_pair: $ => seq($._expression, ':', $._expression),


      assignment: $ => prec.right(PREC.assign, seq($._primary_expression, '=', $._expression)),
      augmented_assignment: $ => prec.right(PREC.assign, seq(
        $._primary_expression,
        choice('+=', '-=', '*=', '/=', '%=', '**='),
        $._expression
      )),

      binary_operator: $ => {
        const table = [
          [prec.left, '+', PREC.plus],
          [prec.left, '-', PREC.plus],
          [prec.left, '*', PREC.times],
          [prec.left, '/', PREC.times],
          [prec.left, '%', PREC.times],
          [prec.left, '**', PREC.power],
        ];
  
        return choice(...table.map(([fn, operator, precedence]) => fn(precedence, seq(
          $._expression,
          operator,
          $._expression
        ))));
      },

      unary_operator: $ => prec(PREC.unary, seq(
        choice('+', '-', 'not'),
        $._expression
      )),

      boolean_operator: $ => choice(
        prec.left(PREC.and, seq($._expression, 'and', $._expression)),
        prec.left(PREC.or, seq($._expression, 'or', $._expression))
      ),

      comparison_operator: $ => prec.left(PREC.compare, seq(
        $._expression,
        choice('==', '!=', '<', '<=', '>', '>=', 'in', 'not in', 'is', 'is not'),
        $._expression
      )),

      identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

      keyword_identifier: $ => alias(choice('print', 'exec', 'len'), $.identifier),

      string: $ => choice(
        seq(
          'f',
          choice(
            seq('"""', repeat(choice(/[^"\\]+/, $.escape_sequence)), '"""'),
            seq('\'\'\'', repeat(choice(/[^'\\]+/, $.escape_sequence)), '\'\'\''),
            seq('"', repeat(choice(/[^"\\]+/, $.escape_sequence)), '"'),
            seq('\'', repeat(choice(/[^'\\]+/, $.escape_sequence)), '\'')
          )
        ),
        choice(
          seq('"""', repeat(choice(/[^"\\]+/, $.escape_sequence)), '"""'),
          seq('\'\'\'', repeat(choice(/[^'\\]+/, $.escape_sequence)), '\'\'\''),
          seq('"', repeat(choice(/[^"\\]+/, $.escape_sequence)), '"'),
          seq('\'', repeat(choice(/[^'\\]+/, $.escape_sequence)), '\'')
        )
      ),

      escape_sequence: $ => token(prec(1, seq(
        '\\',
        choice(
          /[^\n]/,
          /\n/
        )
      ))),

      integer: $ => /\d+/,

      float: $ => /\d*\.\d+|\d+\.\d*/,

      true: $ => 'True',
      false: $ => 'False',
      none: $ => 'None',

      comment: $ => token(seq('#', /.*/)),

      dotted_name: $ => seq($.identifier, repeat(seq('.', $.identifier))),

      parameters: $ => seq('(', optional($._parameter_list), ')'),
      _parameter_list: $ => seq($.identifier, repeat(seq(',', $.identifier))),
    },
  });