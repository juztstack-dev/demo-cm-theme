<?php

return [
    'name' => 'Main Contact',
    'description' => 'Main contact section with a contact form and map',
    'template' => 'main-contact',
    'settings' => [
        'background_color' => [
            'type' => 'color',
            'label' => 'Background Color',
            'default' => '#ffffff'
        ],
        'title' => [
            'type' => 'text',
            'label' => 'Title',
            'default' => 'Contact Us'
        ],
        'description' => [
            'type' => 'textarea',
            'label' => 'Description',
            'default' => ''
        ],
        'contact_form_shortcode' => [
            'type' => 'text',
            'label' => 'Contact Form Shortcode',
            'default' => ''
        ]
    ]
];