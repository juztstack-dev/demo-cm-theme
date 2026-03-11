<?php

namespace JuztStack\JuztOrbit;

use JuztStack\JuztOrbit\JuztStack;
use JuztStack\JuztOrbit\SvgSupport;
use JuztStack\JuztOrbit\Widgets;
use JuztStack\JuztOrbit\Assets;
use JuztStack\JuztOrbit\Extensions;
use JuztStack\JuztOrbit\Api;
use Timber\Site;

if (class_exists('Timber\\Site') === false) {
  return;
}

#[\AllowDynamicProperties]
class StartSite extends Site
{
  public function __construct()
  {
    add_filter('show_admin_bar', [$this, 'hide_admin_bar_in_iframe']);
    add_filter('the_content', [$this, 'optimize_content_images'], 20);
    add_action('after_setup_theme', array($this, 'themeSupports'));
    add_action('init', array($this, 'php_setup'));

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
    new Api();
    return parent::__construct();
  }

  public function hide_admin_bar_in_iframe($show)
  {
    // Detectar si está en iframe
    if (isset($_SERVER['HTTP_SEC_FETCH_DEST']) && $_SERVER['HTTP_SEC_FETCH_DEST'] === 'iframe') {
      return false;
    }
    return $show;
  }

  public function php_setup()
  {
    @ini_set('upload_max_filesize', '64M');
    @ini_set('post_max_size', '64M');
    @ini_set('memory_limit', '128M');
    @ini_set('max_execution_time', '300');
    @ini_set('max_input_time', '300');
  }

  public function optimize_content_images($content)
  {
    if (!is_string($content) || stripos($content, '<img') === false) {
      return $content;
    }

    $image_index = 0;

    return preg_replace_callback('/<img\b[^>]*>/i', function ($matches) use (&$image_index) {
      $img_tag = $matches[0];
      $is_first_image = $image_index === 0;
      $image_index++;

      $img_tag = $this->set_or_replace_img_attr($img_tag, 'decoding', 'async');
      $img_tag = $this->set_or_replace_img_attr($img_tag, 'loading', $is_first_image ? 'eager' : 'lazy');
      $img_tag = $this->set_or_replace_img_attr($img_tag, 'fetchpriority', $is_first_image ? 'high' : 'auto');
      //$img_tag = $this->sanitize_img_style_attr($img_tag);
      $img_tag = $this->sanitize_img_class_attr($img_tag);
      $img_tag = $this->add_img_srcset_and_sizes($img_tag);
 
      return $img_tag;
    }, $content);
  }

  private function sanitize_img_class_attr($img_tag)
  {
    if (!preg_match('/\sclass=("[^"]*"|\'[^\']*\')/i', $img_tag, $class_match)) {
      return $img_tag;
    }

    $quote = substr($class_match[1], 0, 1);
    $class_value = trim($class_match[1], "\"'");
    $classes = preg_split('/\s+/', $class_value, -1, PREG_SPLIT_NO_EMPTY);

    $classes = array_values(array_filter($classes, function ($class_name) {
      $class_lc = strtolower($class_name);
      return !in_array($class_lc, ['lazy', 'entered', 'loaded', 'lazyloaded', 'lazyload', 'lazyloading'], true);
    }));

    if (empty($classes)) {
      return preg_replace('/\sclass=("[^"]*"|\'[^\']*\')/i', '', $img_tag, 1);
    }

    return preg_replace(
      '/\sclass=("[^"]*"|\'[^\']*\')/i',
      ' class=' . $quote . esc_attr(implode(' ', $classes)) . $quote,
      $img_tag,
      1
    );
  }

  private function add_img_srcset_and_sizes($img_tag)
  {
    if (stripos($img_tag, 'srcset=') !== false && stripos($img_tag, 'sizes=') !== false) {
      return $img_tag;
    }

    if (!preg_match('/wp-image-(\d+)/i', $img_tag, $id_match)) {
      return $img_tag;
    }

    $attachment_id = (int) $id_match[1];
    if ($attachment_id <= 0) {
      return $img_tag;
    }

    $metadata = wp_get_attachment_metadata($attachment_id);
    if (empty($metadata)) {
      return $img_tag;
    }

    if (function_exists('wp_image_add_srcset_and_sizes')) {
      return wp_image_add_srcset_and_sizes($img_tag, $metadata, $attachment_id);
    }

    return $img_tag;
  }

  private function set_or_replace_img_attr($img_tag, $attr, $value)
  {
    $pattern = '/\s' . preg_quote($attr, '/') . '=("[^"]*"|\'[^\']*\')/i';

    if (preg_match($pattern, $img_tag)) {
      return preg_replace($pattern, ' ' . $attr . '="' . esc_attr($value) . '"', $img_tag);
    }

    return preg_replace('/<img\b/i', '<img ' . $attr . '="' . esc_attr($value) . '"', $img_tag, 1);
  }

  private function sanitize_img_style_attr($img_tag)
  {
    if (!preg_match('/\sstyle=("[^"]*"|\'[^\']*\')/i', $img_tag, $style_match)) {
      return $img_tag;
    }

    $quote = substr($style_match[1], 0, 1);
    $style_value = trim($style_match[1], "\"'");

    $style_rules = array_filter(array_map('trim', explode(';', $style_value)));

    $filtered_rules = array_filter($style_rules, function ($rule) {
      $rule_lc = strtolower($rule);
      return strpos($rule_lc, 'aspect-ratio:') !== 0
        && strpos($rule_lc, 'object-fit:') !== 0
        && strpos($rule_lc, 'width:') !== 0
        && strpos($rule_lc, 'height:') !== 0;
    });

    $new_style = implode('; ', $filtered_rules);

    if ($new_style !== '') {
      $new_style = $new_style . ';';
      return preg_replace(
        '/\sstyle=("[^"]*"|\'[^\']*\')/i',
        ' style=' . $quote . esc_attr($new_style) . $quote,
        $img_tag,
        1
      );
    }

    return preg_replace('/\sstyle=("[^"]*"|\'[^\']*\')/i', '', $img_tag, 1);
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
