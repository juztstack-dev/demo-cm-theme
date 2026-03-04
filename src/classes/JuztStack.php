<?php

namespace JuztStack\JuztOrbit;

use Juztstack\JuztStudio\Community\Core;

class JuztStack
{
  public function __construct()
  {
    add_filter('timber/locations', [$this, 'loadTwig'], 100);
  }

  public function loadTwig($paths)
  {
    if (!is_array($paths)) {
        $paths = [];
    }
    
    $paths[] = [JUZT_ORBIT_DIR . '/views/sections'];
    $paths[] = [JUZT_ORBIT_DIR . '/views/snippets'];
    
    $core = Core::get_instance();
    
    if ($core && isset($core->extension_registry)) {
        $extensions = $core->extension_registry->get_extensions();
        
        foreach ($extensions as $ext_id => $ext_config) {
            if (!empty($ext_config['paths']['sections_dir'])) {
                $sections_dir = $ext_config['paths']['sections_dir'];
                

                $paths[] = [$sections_dir];
                
                if (is_dir($sections_dir)) {
                    $section_folders = glob($sections_dir . '/*', GLOB_ONLYDIR);
                    foreach ($section_folders as $folder) {
                        $paths[] = [$folder];
                    }
                }
            }
        }
    }
    
    return $paths;
  }
}