<?php

return [
  "name" => "main-hero",
  "tag" => "section",
  "settings" => [
    "gradient_color_1" => [
      "type" => "color",
      "label" => "Gradient Color 1",
      "default" => "#FF6B6B"
    ],
    "gradient_color_2" => [
      "type" => "color",
      "label" => "Gradient Color 2",
      "default" => "#FFD93D"
    ],
    "max_width" => [
      "type" => "select",
      "label" => "Max Width",
      "options" => [
        "container" => "Container",
        "container-fluid" => "Full Width"
      ],
      "default" => "container"
    ]
  ],
  "blocks" => [
    "slide" => [
      "name" => "Slide",
      "description" => "Slide for the main hero",
      "max" => 5,
      "settings" => [
        "title" => [
          "type" => "text",
          "label" => "Title",
          "default" => "Welcome to Juzt Orbit"
        ],
        "subtitle" => [
          "type" => "text",
          "label" => "Subtitle",
          "default" => "Your journey starts here"
        ],
        "button_text" => [
          "type" => "text",
          "label" => "Button Text",
          "default" => "Get Started"
        ],
        "button_link" => [
          "type" => "text",
          "label" => "Button Link",
          "default" => "#"
        ]
      ]
    ]
  ]
];