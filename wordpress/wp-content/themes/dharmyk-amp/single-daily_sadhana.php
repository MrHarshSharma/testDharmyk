<?php
/**
 * Single Daily Sadhana Template
 * 
 * Routes to appropriate card template based on query parameter
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

get_header();

// Get the card type from query parameter
$card_type = dharmyk_get_card_type();

// Load the appropriate card template
$template_file = 'template-parts/card-' . $card_type . '.php';

if (locate_template($template_file)) {
    get_template_part('template-parts/card', $card_type);
} else {
    // Fallback to intro if template not found
    get_template_part('template-parts/card', 'intro');
}

get_footer();
