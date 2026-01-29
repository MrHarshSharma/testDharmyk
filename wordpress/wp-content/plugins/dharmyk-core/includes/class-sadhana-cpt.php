<?php
/**
 * Custom Post Type: Daily Sadhana
 * 
 * Registers the daily_sadhana custom post type for managing daily spiritual practice content
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Dharmyk_Sadhana_CPT {
    
    /**
     * Post type slug
     */
    const POST_TYPE = 'daily_sadhana';
    
    /**
     * Register the custom post type
     */
    public function register() {
        $labels = array(
            'name'                  => _x('Daily Sadhanas', 'Post type general name', 'dharmyk-core'),
            'singular_name'         => _x('Daily Sadhana', 'Post type singular name', 'dharmyk-core'),
            'menu_name'             => _x('Daily Sadhanas', 'Admin Menu text', 'dharmyk-core'),
            'name_admin_bar'        => _x('Daily Sadhana', 'Add New on Toolbar', 'dharmyk-core'),
            'add_new'               => __('Add New', 'dharmyk-core'),
            'add_new_item'          => __('Add New Daily Sadhana', 'dharmyk-core'),
            'new_item'              => __('New Daily Sadhana', 'dharmyk-core'),
            'edit_item'             => __('Edit Daily Sadhana', 'dharmyk-core'),
            'view_item'             => __('View Daily Sadhana', 'dharmyk-core'),
            'all_items'             => __('All Daily Sadhanas', 'dharmyk-core'),
            'search_items'          => __('Search Daily Sadhanas', 'dharmyk-core'),
            'not_found'             => __('No daily sadhanas found.', 'dharmyk-core'),
            'not_found_in_trash'    => __('No daily sadhanas found in Trash.', 'dharmyk-core'),
        );
        
        $args = array(
            'labels'                => $labels,
            'description'           => __('Daily spiritual practice content', 'dharmyk-core'),
            'public'                => true,
            'publicly_queryable'    => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'query_var'             => true,
            'rewrite'               => array('slug' => 'sadhana'),
            'capability_type'       => 'post',
            'has_archive'           => false,
            'hierarchical'          => false,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-book-alt',
            'supports'              => array('title', 'editor', 'custom-fields'),
            'show_in_rest'          => true,
            'rest_base'             => 'sadhanas',
        );
        
        register_post_type(self::POST_TYPE, $args);
        
        // Flush rewrite rules on activation
        flush_rewrite_rules();
    }
    
    /**
     * Get post type slug
     */
    public static function get_post_type() {
        return self::POST_TYPE;
    }
}
