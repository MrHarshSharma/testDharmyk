<?php
/**
 * Plugin Name: Dharmyk Core
 * Plugin URI: https://dharmyk.app
 * Description: Core functionality for Dharmyk spiritual journey app - manages Daily Sadhana content and REST API
 * Version: 1.0.0
 * Author: Dharmyk Team
 * Author URI: https://dharmyk.app
 * License: GPL v2 or later
 * Text Domain: dharmyk-core
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DHARMYK_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DHARMYK_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DHARMYK_VERSION', '1.0.0');

/**
 * Main Dharmyk Core Plugin Class
 */
class Dharmyk_Core {
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Load required dependencies
     */
    private function load_dependencies() {
        require_once DHARMYK_PLUGIN_DIR . 'includes/class-sadhana-cpt.php';
        require_once DHARMYK_PLUGIN_DIR . 'includes/class-sadhana-rest.php';
        require_once DHARMYK_PLUGIN_DIR . 'includes/acf-fields.php';
    }
    
    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    
    /**
     * Initialize plugin components
     */
    public function init() {
        // Register Custom Post Type
        $sadhana_cpt = new Dharmyk_Sadhana_CPT();
        $sadhana_cpt->register();
        
        // Register ACF Fields
        if (function_exists('acf_add_local_field_group')) {
            dharmyk_register_acf_fields();
        }
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        $rest_controller = new Dharmyk_Sadhana_REST();
        $rest_controller->register_routes();
    }
}

// Initialize the plugin
function dharmyk_core_init() {
    return new Dharmyk_Core();
}

// Start the plugin
add_action('plugins_loaded', 'dharmyk_core_init');
