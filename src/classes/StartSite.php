<?php

namespace JuztStack\JuztOrbit;

use JuztStack\JuztOrbit\JuztStack;
use JuztStack\JuztOrbit\SvgSupport;
use JuztStack\JuztOrbit\Widgets;
use JuztStack\JuztOrbit\Assets;
use JuztStack\JuztOrbit\Extensions;
use Timber\Site;

if (class_exists('Timber\\Site') === false) {
  return;
}

#[\AllowDynamicProperties]
class StartSite extends Site
{
  public function __construct()
  {
    add_action('after_setup_theme', array($this, 'themeSupports'));
    new Extensions();
    new JuztStack();
    new Assets([
      "dev" => [
        "js" => [
          "juzt-orbit-script" => "/frontend/js/index.js"
        ]
      ],
      "prod" => [
        "js" => [
          "juzt-orbit-script-module" => "/assets/js/script.js"
        ],
        "css" => [
          "juzt-orbit-style" => "/style.css",
          "juzt-orbit-style-module" => "/assets/css/style.css"
        ]
      ]
    ]);
    new SvgSupport();
    new Widgets();
    return parent::__construct();
  }

  public function themeSupports()
  {
    add_theme_support('title-tag');

    add_theme_support('post-thumbnails');

    add_theme_support('menus');

    add_theme_support(
      'html5',
      array(
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
      )
    );

    add_theme_support(
      'post-formats',
      array(
        'aside',
        'image',
        'video',
        'quote',
        'link',
        'gallery',
        'audio',
      )
    );

    add_theme_support('sections-builder', [
      'sections_directory' => 'sections',
      'templates_directory' => 'templates',
      'snippets_directory' => 'snippets',
      'views_sections_directory' => 'views/sections',  // Para Twig
      'schemas_directory' => 'schemas'                 // Para Builder
    ]);
  }
}
