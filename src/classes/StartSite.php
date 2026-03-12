<?php

namespace JuztStack\JuztOrbit;

use JuztStack\JuztOrbit\JuztStack;
use JuztStack\JuztOrbit\SvgSupport;
use JuztStack\JuztOrbit\Widgets;
use JuztStack\JuztOrbit\Assets;
use JuztStack\JuztOrbit\Extensions;
use JuztStack\JuztOrbit\Api;
use JuztStack\JuztOrbit\Auth;
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
    add_action('wp_nav_menu_item_custom_fields', [$this, 'render_menu_role_visibility_field'], 10, 5);
    add_action('wp_update_nav_menu_item', [$this, 'save_menu_role_visibility_field'], 10, 3);
    add_filter('wp_get_nav_menu_items', [$this, 'filter_nav_menu_items_by_role'], 10, 3);
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
    new Auth();
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

  private function get_menu_visibility_roles()
  {
    $roles = [
      '' => 'Everyone',
      '__logged_in' => 'Logged-in users',
      '__logged_out' => 'Guests only',
    ];

    $wp_roles = wp_roles();
    if ($wp_roles && !empty($wp_roles->roles)) {
      foreach ($wp_roles->roles as $role_key => $role_data) {
        $roles[$role_key] = $role_data['name'] ?? ucfirst($role_key);
      }
    }

    return $roles;
  }

  public function render_menu_role_visibility_field($item_id, $item, $depth, $args, $id)
  {
    $selected = (string) get_post_meta($item_id, '_juzt_menu_role_visibility', true);
    $available_roles = $this->get_menu_visibility_roles();

    ?>
    <p class="description description-wide juzt-menu-role-visibility-field">
      <label for="edit-menu-item-juzt-role-<?php echo esc_attr($item_id); ?>">
        <?php esc_html_e('Visible for role', 'juzt-orbit'); ?><br />
        <select
          id="edit-menu-item-juzt-role-<?php echo esc_attr($item_id); ?>"
          class="widefat code edit-menu-item-juzt-role"
          name="menu-item-juzt-role[<?php echo esc_attr($item_id); ?>]"
        >
          <?php foreach ($available_roles as $role_value => $role_label) : ?>
            <option value="<?php echo esc_attr($role_value); ?>" <?php selected($selected, $role_value); ?>>
              <?php echo esc_html($role_label); ?>
            </option>
          <?php endforeach; ?>
        </select>
      </label>
    </p>
    <?php
  }

  public function save_menu_role_visibility_field($menu_id, $menu_item_db_id, $args)
  {
    if (!isset($_POST['menu-item-juzt-role']) || !is_array($_POST['menu-item-juzt-role'])) {
      delete_post_meta($menu_item_db_id, '_juzt_menu_role_visibility');
      return;
    }

    $raw_value = $_POST['menu-item-juzt-role'][$menu_item_db_id] ?? '';
    $selected_role = sanitize_key((string) $raw_value);
    $available_roles = $this->get_menu_visibility_roles();

    if (!array_key_exists($selected_role, $available_roles)) {
      $selected_role = '';
    }

    if ($selected_role === '') {
      delete_post_meta($menu_item_db_id, '_juzt_menu_role_visibility');
      return;
    }

    update_post_meta($menu_item_db_id, '_juzt_menu_role_visibility', $selected_role);
  }

  public function filter_nav_menu_items_by_role($items, $menu, $args)
  {
    if (is_admin()) {
      return $items;
    }

    if (!is_array($items) || empty($items)) {
      return $items;
    }

    $is_logged_in = is_user_logged_in();
    $current_user_roles = $is_logged_in ? (array) wp_get_current_user()->roles : [];

    $filtered = array_values(array_filter($items, function ($item) use ($is_logged_in, $current_user_roles) {
      $required_role = (string) get_post_meta($item->ID, '_juzt_menu_role_visibility', true);

      if ($required_role === '') {
        return true;
      }

      if ($required_role === '__logged_in') {
        return $is_logged_in;
      }

      if ($required_role === '__logged_out') {
        return !$is_logged_in;
      }

      if (!$is_logged_in) {
        return false;
      }

      return in_array($required_role, $current_user_roles, true);
    }));

    return $filtered;
  }
}
