<?php

return [
  "name" => "hello-orbit",
  "tag" => "section",
  "settings" => [
    "title" => [
      "type" => "text",
      "label" => "Title",
      "default" => "Hello Orbit"
    ],
    "background" => [
      "type" => "color",
      "label" => "Background Color",
      "default" => "#6433ff"
    ],
    "color" => [
      "type" => "color",
      "label" => "Text Color",
      "default" => "#ffffff"
    ]
  ],
  "blocks" => [
    "feature" => [
      "name" => "Feature",
      "description" => "Feature for the theme",
      "max" => 10,
      "settings" => [
        "title" => [
          "type" => "text",
          "label" => "Title",
          "default" => ""
        ],
        "description" => [
          "type" => "textarea",
          "label" => "Description",
          "default" => ""
        ]
      ]
    ],
    "docs" => [
      "name" => "Docs",
      "description" => "Docs for the theme",
      "max" => 10,
      "settings" => [
        "title" => [
          "type" => "text",
          "label" => "Title",
          "default" => ""
        ],
        "description" => [
          "type" => "textarea",
          "label" => "Description",
          "default" => ""
        ],
        "link" => [
          "type" => "text",
          "label" => "Link",
          "default" => "#"
        ]
      ]
    ]
  ]
];