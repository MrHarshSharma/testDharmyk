<?php
/**
 * Theme Functions
 * 
 * Sets up AMP support and custom functionality
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function dharmyk_amp_setup() {
    // Add AMP support
    add_theme_support('amp');
    
    // Add title tag support
    add_theme_support('title-tag');
    
    // Add custom logo support
    add_theme_support('custom-logo');
}
add_action('after_setup_theme', 'dharmyk_amp_setup');

/**
 * Enqueue styles
 */
function dharmyk_amp_enqueue_styles() {
    wp_enqueue_style('dharmyk-amp-style', get_stylesheet_uri(), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'dharmyk_amp_enqueue_styles');

/**
 * Add custom rewrite rules for card URLs
 */
function dharmyk_amp_rewrite_rules() {
    add_rewrite_rule(
        '^sadhana/([0-9]+)/?$',
        'index.php?post_type=daily_sadhana&p=$matches[1]',
        'top'
    );
}
add_action('init', 'dharmyk_amp_rewrite_rules');

/**
 * Add query vars for card parameter
 */
function dharmyk_amp_query_vars($vars) {
    $vars[] = 'card';
    return $vars;
}
add_filter('query_vars', 'dharmyk_amp_query_vars');

/**
 * Get card type from query parameter
 */
function dharmyk_get_card_type() {
    $card = get_query_var('card', 'intro');
    $allowed_cards = array('intro', 'shloka', 'katha', 'smriti', 'manana');
    
    if (!in_array($card, $allowed_cards)) {
        return 'intro';
    }
    
    return $card;
}

/**
 * Get ACF field safely
 */
function dharmyk_get_field($field_name, $post_id = null) {
    if (!function_exists('get_field')) {
        return '';
    }
    
    return get_field($field_name, $post_id) ?: '';
}
