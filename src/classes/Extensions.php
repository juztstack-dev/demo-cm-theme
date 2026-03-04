<?php

namespace JuztStack\JuztOrbit;

use \Juztstack\JuztStudio\Community\Core;

class Extensions
{
    public function __construct()
    {
        add_filter('timber/locations', array($this, 'load_extensions'), 100);
    }

    public function load_extensions($paths)
    {
        if (!is_array($paths)) {
            $paths = [];
        }
        
        $core = Core::get_instance();

        if (!$core || !isset($core->extension_registry)) {
            return $paths;
        }

        $extensions = $core->extension_registry->get_extensions();

        foreach ($extensions as $ext_id => $ext_config) {
            if (!empty($ext_config['paths']['sections_dir'])) {
                $sections_dir = $ext_config['paths']['sections_dir'];
                
                // ✅ Cada path en su propio sub-array
                $paths[] = [$sections_dir];
                
                if (is_dir($sections_dir)) {
                    $section_folders = glob($sections_dir . '/*', GLOB_ONLYDIR);
                    foreach ($section_folders as $folder) {
                        $paths[] = [$folder];
                    }
                }
            }

            if (!empty($ext_config['paths']['snippets_dir'])) {
                $paths[] = [$ext_config['paths']['snippets_dir']];
            }
        }

        return $paths;
    }
}