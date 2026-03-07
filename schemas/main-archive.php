<?php

return [
  "name" => "main-archive",
  "tag" => "section",
  "settings" => [
    "pagination_type" => [
      "type" => "select",
      "label" => "Pagination type",
      "options" => [
        "numeric" => "Numeric",
        "load_more" => "Load more button",
        "infinite_scroll" => "Infinite scroll"
      ],
      "default" => "numeric"
    ],
    "quantity_cols_desktop" => [
      "type" => "select",
      "label" => "Quantity of columns (desktop)",
      "options" => [
        1 => "1 column",
        2 => "2 columns",
        3 => "3 columns",
        4 => "4 columns"
      ],
      "default" => 3
    ],
    "quantity_cols_tablet" => [
      "type" => "select",
      "label" => "Quantity of columns (tablet)",
      "options" => [
        1 => "1 column",
        2 => "2 columns",
        3 => "3 columns",
        4 => "4 columns"
      ]
    ],
    "quantity_cols_mobile" => [
      "type" => "select",
      "label" => "Quantity of columns (mobile)",
      "options" => [
        1 => "1 column",
        2 => "2 columns",
        3 => "3 columns",
        4 => "4 columns"
      ]
    ]
  ],
  "blocks" => [
  ]
];