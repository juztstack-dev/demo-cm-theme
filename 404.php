<?php
if (!defined('ABSPATH')) {
    exit;
}

use Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

global $wp_query;

// Cargar template JSON
$template_loader = new Templates();
$template_content = $template_loader->get_json_template('no-found');

if (!$template_content) {
    echo '<h1>⚠️ Template not found</h1>';
    return;
}

// Setup contexto
$context = Timber::context();

// ✅ Usar el query GLOBAL (ya tiene posts_per_page correcto)
$context['posts'] = Timber::get_posts();

$context['order'] = $template_content['order'] ?? [];
$context['sections'] = $template_content['sections'] ?? [];

// Renderizar
Timber::render('templates/index.twig', $context);