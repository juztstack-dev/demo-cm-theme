<?php

return [
  "name" => "main-page",
  "tag" => "section",
  "settings" => [
    "background" => [
      "type" => "color",
      "label" => "Meta Heading Background Color",
      "default" => "#6433ff"
    ],
    'show_post_date' => [
      'type' => 'boolean',
      'label' => 'Show Post Date',
      'default' => true,
    ],
    'show_post_author' => [
      'type' => 'boolean',
      'label' => 'Show Post Author',
      'default' => true,
    ],
    'show_post_navigation' => [
      'type' => 'boolean',
      'label' => 'Show Post Navigation',
      'default' => true,
    ]
  ],
  "blocks" => []
];