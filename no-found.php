<?php
/**
 * Template Name: No Found
 * Template Post Type: page
 * Description: Template for 404 page
 *
 * @package  JuztTheme
 * @subpackage  Timber
 * @since   Timber 0.1
 */

use \Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

$template = new Templates();
$template_content = $template->get_json_template('no-found');
$context = Timber::context();
$context['order'] = $template_content['order'];
$context['sections'] = $template_content['sections'];

Timber::render('templates/index.twig', $context); 
