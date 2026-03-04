<?php

namespace JuztStack\JuztOrbit;

class Assets 
{
  private $assets;

  public function __construct($assets=[])
  {
    $this->assets = $assets;

    add_action(
      'wp_enqueue_scripts',
      array(
        $this,
        'enqueueStyles'
      )
    );

    add_action(
      'wp_enqueue_scripts',
      array(
        $this,
        'enqueueScripts'
      )
    );
  }

  public function enqueueStyles()
  {
    wp_enqueue_style(
      'juzt-orbit-style',
      get_template_directory_uri() . '/style.css',
      array(),
      JUZT_ORBIT_VERSION,
      'all');
  }

  public function enqueueScripts()
  {

    if(JUZT_ORBIT_DEVELOPMENT_MODE){
      // Development mode
      if (isset($this->assets['dev']['js'])) {
        foreach ($this->assets['dev']['js'] as $handle => $path) {
          wp_enqueue_script(
            $handle,
            get_template_directory_uri() . $path,
            array(),
            JUZT_ORBIT_VERSION,
            true
          );
        }
      }
    } else {
      // Production mode
      if (isset($this->assets['prod']['js'])) {
        foreach ($this->assets['prod']['js'] as $handle => $path) {
          wp_enqueue_script(
            $handle,
            get_template_directory_uri() . $path,
            array(),
            JUZT_ORBIT_VERSION,
            true
          );
        }
      }

      if (isset($this->assets['prod']['css'])) {
        foreach ($this->assets['prod']['css'] as $handle => $path) {
          wp_enqueue_style(
            $handle,
            get_template_directory_uri() . $path,
            array(),
            JUZT_ORBIT_VERSION,
            'all'
          );
        }
      }
    }

  }
}