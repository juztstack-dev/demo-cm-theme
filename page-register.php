<?php
/**
 * Template Name: Register
 * Template Post Type: page
 * Description: Register page template with a registration form
 *
 * @package  JuztTheme
 * @subpackage  Timber
 * @since   Timber 0.1
 */

use \Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

$template = new Templates();
$template_content = $template->get_json_template('page-register');
$context = Timber::context();
$context['order'] = $template_content['order'];
$context['sections'] = $template_content['sections'];

Timber::render('templates/index.twig', $context); 
