<?php

/**
 * @package JuztOrbit-Theme
 * @subpackage Timber
 * @since Timber 0.1
 */

use Timber\Timber;
use JuztStack\JuztOrbit\StartSite;

define('JUZT_ORBIT_VERSION', '0.0.11');
define('JUZT_ORBIT_DIR', get_template_directory(__FILE__));
define('JUZT_ORBIT_URL', get_template_directory_uri(__FILE__));
define('JUZT_ORBIT_DEVELOPMENT_MODE', false); // Change to false in production
define('JUZT_STACK_DEBUG', true);

require_once JUZT_ORBIT_DIR . '/vendor/autoload.php';

if (class_exists('Timber\\Timber')) {
    Timber::$dirname = array('views');
}

if (class_exists('JuztStack\\JuztOrbit\\StartSite')) {
    new StartSite();
}