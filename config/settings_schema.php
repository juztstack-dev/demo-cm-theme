<?php

return [
  '$schema' => 'https://json-schema.org/draft-07/schema#',
  'title' => 'Theme general settings',
  'description' => 'Global settings for Juzt Orbit theme',
  'type' => 'object',

  'properties' => [
    #General settings
    'layout' => [
      'type' => 'string',
      'title' => 'Layout',
      'enum' => ['boxed', 'full'],
      'enumNames' => ['Boxed', 'Full'],
      'default' => 'full',
      'tab' => 'general',
      'group' => 'General settings',
    ],

    'code_js' => [
      'type' => 'code',
      'title' => 'Custom JavaScript code',
      'language' => 'javascript',
      'default' => '',
      'tab' => 'general',
      'group' => 'Custom code',
      'expandable' => true,
    ],

    'favicon_image' => [
      'type' => 'file',
      'title' => 'Favicon Image',
      'default' => '',
      'tab' => 'general',
      'group' => 'Brand assets',
    ],

    'primary_color' => [
      'type' => 'string',
      'format' => 'color',
      'title' => 'Primary color',
      'default' => '#111111',
      'tab' => 'colors',
      'group' => 'Brand colors',
    ],

    'secondary_color' => [
      'type' => 'string',
      'format' => 'color',
      'title' => 'Secondary color',
      'default' => '#111111',
      'tab' => 'colors',
      'group' => 'Brand colors',
    ],

    'primary_text_color' => [
      'type' => 'string',
      'format' => 'color',
      'title' => 'Primary text color',
      'default' => '#ffffff',
      'tab' => 'colors',
      'group' => 'Brand colors',
    ],

    'secondary_text_color' => [
      'type' => 'string',
      'format' => 'color',
      'title' => 'Secondary text color',
      'default' => '#111111',
      'tab' => 'colors',
      'group' => 'Brand colors',
    ],

    'footer_text' => [
      'type' => 'richtext',
      'title' => 'Footer text',
      'default' => '',
      'tab' => 'content',
      'group' => 'Footer',
      'expandable' => true,
    ],

    #header
    'header_background_color' => [
      'type' => 'string',
      'format' => 'color',
      'title' => 'Header background color',
      'default' => '#000',
      'tab' => 'header',
      'group' => 'Header',
    ],
    'header_logo' => [
      'type' => 'file',
      'title' => 'Logo',
      'default' => '',
      'tab' => 'header',
      'group' => 'Header',
    ],
    'header_main_menu' => [
      'type' => 'menu',
      'title' => 'Main Menu',
      'default' => '',
      'tab' => 'header',
      'group' => 'Header',
    ],
    'header_show_search' => [
      'type' => 'boolean',
      'title' => 'Show search',
      'default' => false,
      'tab' => 'header',
      'group' => 'Header',
    ],
    'header_type_mobile_menu' => [
      'type' => 'string',
      'title' => 'Mobile menu type',
      'enum' => ['offcanvas', 'dropdown'],
      'enumNames' => ['Off-canvas', 'Dropdown'],
      'default' => 'offcanvas',
      'tab' => 'header',
      'group' => 'Header',
    ],

  ]
];