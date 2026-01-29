<?php
/**
 * REST API Controller for Sadhana Content
 * 
 * Provides endpoint: GET /wp-json/dharmyk/v1/sadhana?date=YYYY-MM-DD
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Dharmyk_Sadhana_REST extends WP_REST_Controller {
    
    /**
     * Namespace for REST API
     */
    protected $namespace = 'dharmyk/v1';
    
    /**
     * Rest base
     */
    protected $rest_base = 'sadhana';
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base, array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_sadhana'),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'date' => array(
                        'required'          => true,
                        'type'              => 'string',
                        'description'       => 'Date in YYYY-MM-DD format',
                        'validate_callback' => array($this, 'validate_date'),
                    ),
                ),
            ),
        ));
    }
    
    /**
     * Validate date parameter
     */
    public function validate_date($param, $request, $key) {
        $date = \DateTime::createFromFormat('Y-m-d', $param);
        return $date && $date->format('Y-m-d') === $param;
    }
    
    /**
     * Get Sadhana by date
     */
    public function get_sadhana($request) {
        $date = $request->get_param('date');
        
        // Query for sadhana post with matching date
        $args = array(
            'post_type'      => Dharmyk_Sadhana_CPT::get_post_type(),
            'posts_per_page' => 1,
            'post_status'    => 'publish',
            'meta_query'     => array(
                array(
                    'key'     => 'sadhana_date',
                    'value'   => $date,
                    'compare' => '=',
                    'type'    => 'DATE',
                ),
            ),
        );
        
        $query = new WP_Query($args);
        
        if (!$query->have_posts()) {
            return new WP_Error(
                'no_sadhana',
                'No Sadhana found for this date',
                array('status' => 404)
            );
        }
        
        $post = $query->posts[0];
        $post_id = $post->ID;
        
        // Get ACF fields
        $theme = get_field('theme', $post_id);
        
        // Build card URLs
        // Use home_url() which is configured to the correct network IP
        $base_url = home_url("/sadhana/{$post_id}");
        
        $cards = array(
            array(
                'type' => 'intro',
                'url'  => $base_url . '?card=intro',
            ),
            array(
                'type' => 'shloka',
                'url'  => $base_url . '?card=shloka',
            ),
            array(
                'type' => 'katha',
                'url'  => $base_url . '?card=katha',
            ),
            array(
                'type' => 'smriti',
                'url'  => $base_url . '?card=smriti',
            ),
            array(
                'type' => 'manana',
                'url'  => $base_url . '?card=manana',
            ),
        );
        
        // Build response
        $response = array(
            'id'    => $post_id,
            'date'  => $date,
            'title' => get_the_title($post_id),
            'theme' => $theme ?: '',
            'cards' => $cards,
        );
        
        return rest_ensure_response($response);
    }
}
