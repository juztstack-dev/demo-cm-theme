<?php
if (!defined('ABSPATH')) {
    exit;
}

use Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

$template_loader = new Templates();
$template_content = $template_loader->get_json_template('tag');

if (!$template_content) {
    echo '<h1>⚠️ Template not found</h1>';
    return;
}

$context = Timber::context();
$context['posts'] = Timber::get_posts();
$context['order'] = $template_content['order'] ?? [];
$context['sections'] = $template_content['sections'] ?? [];

Timber::render('templates/index.twig', $context);
