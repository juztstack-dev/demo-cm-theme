<?php

return [
  "$schema" => "https://json-schema.org/draft-07/schema#",
  "title" => "Theme general settings",
  "description" => "Global settings for Juzt Orbit theme",
  "type" => "object",

  "properties" => [
    "main_menu" => [
      "type" => "menu",
      "label" => "Main Menu",
      "default" => ""
    ]
  ]
];