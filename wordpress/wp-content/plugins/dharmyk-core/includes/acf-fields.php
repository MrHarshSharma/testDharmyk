<?php
/**
 * ACF Field Definitions for Daily Sadhana
 * 
 * Registers all custom fields needed for Sadhana content
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register ACF field groups
 */
function dharmyk_register_acf_fields() {
    
    // Main Sadhana Fields
    acf_add_local_field_group(array(
        'key' => 'group_sadhana_main',
        'title' => 'Sadhana Content',
        'fields' => array(
            
            // Date Field
            array(
                'key' => 'field_sadhana_date',
                'label' => 'Sadhana Date',
                'name' => 'sadhana_date',
                'type' => 'date_picker',
                'instructions' => 'Select the date for this daily Sadhana',
                'required' => 1,
                'display_format' => 'Y-m-d',
                'return_format' => 'Y-m-d',
                'first_day' => 1,
            ),
            
            // Theme Field
            array(
                'key' => 'field_theme',
                'label' => 'Theme',
                'name' => 'theme',
                'type' => 'text',
                'instructions' => 'Daily theme (e.g., "Steadiness in Action")',
                'required' => 0,
                'maxlength' => 100,
            ),
            
            // Intro Card Tab
            array(
                'key' => 'field_tab_intro',
                'label' => 'Intro Card',
                'type' => 'tab',
                'placement' => 'top',
            ),
            
            array(
                'key' => 'field_intro_title',
                'label' => 'Intro Title',
                'name' => 'intro_title',
                'type' => 'text',
                'instructions' => 'Title for the intro card',
                'default_value' => 'Welcome to Your Sadhana',
            ),
            
            array(
                'key' => 'field_intro_description',
                'label' => 'Intro Description',
                'name' => 'intro_description',
                'type' => 'textarea',
                'instructions' => 'Brief description for the intro card',
                'rows' => 4,
            ),
            
            array(
                'key' => 'field_intro_image',
                'label' => 'Intro Image URL',
                'name' => 'intro_image_url',
                'type' => 'image',
                'instructions' => 'Image URL for intro card (optional)',
                'return_format' => 'url',
                'preview_size' => 'medium',
                'library' => 'all',
            ),
            
            // Shloka Card Tab
            array(
                'key' => 'field_tab_shloka',
                'label' => 'Shloka (Verse)',
                'type' => 'tab',
            ),
            
            array(
                'key' => 'field_shloka_text',
                'label' => 'Sanskrit Verse',
                'name' => 'shloka_text',
                'type' => 'textarea',
                'instructions' => 'Sanskrit text of the verse',
                'rows' => 4,
            ),
            
            array(
                'key' => 'field_shloka_translation',
                'label' => 'English Translation',
                'name' => 'shloka_translation',
                'type' => 'textarea',
                'instructions' => 'English translation of the verse',
                'rows' => 4,
            ),
            
            array(
                'key' => 'field_shloka_audio',
                'label' => 'Audio URL',
                'name' => 'shloka_audio_url',
                'type' => 'file',
                'instructions' => 'URL to audio file for verse recitation',
                'return_format' => 'url',
                'library' => 'all',
                'mime_types' => 'mp3,wav,m4a,ogg',
            ),
            
            // Katha Card Tab
            array(
                'key' => 'field_tab_katha',
                'label' => 'Katha (Story)',
                'type' => 'tab',
            ),
            
            array(
                'key' => 'field_katha_title',
                'label' => 'Story Title',
                'name' => 'katha_title',
                'type' => 'text',
                'instructions' => 'Title of the story',
            ),
            
            array(
                'key' => 'field_katha_content',
                'label' => 'Story Content',
                'name' => 'katha_content',
                'type' => 'wysiwyg',
                'instructions' => 'Full story content',
                'tabs' => 'all',
                'toolbar' => 'basic',
                'media_upload' => 0,
            ),
            
            array(
                'key' => 'field_katha_image',
                'label' => 'Story Image URL',
                'name' => 'katha_image_url',
                'type' => 'image',
                'instructions' => 'Image URL for the story',
                'return_format' => 'url',
                'preview_size' => 'medium',
                'library' => 'all',
            ),
            
            // Smriti Card Tab
            array(
                'key' => 'field_tab_smriti',
                'label' => 'Smriti (Quiz)',
                'type' => 'tab',
            ),
            
            array(
                'key' => 'field_smriti_question',
                'label' => 'Quiz Question',
                'name' => 'smriti_question',
                'type' => 'text',
                'instructions' => 'The quiz question',
            ),
            
            
            array(
                'key' => 'field_smriti_option_1',
                'label' => 'Option 1',
                'name' => 'smriti_option_1',
                'type' => 'text',
                'instructions' => 'First quiz option',
                'required' => 1,
            ),
            
            array(
                'key' => 'field_smriti_option_2',
                'label' => 'Option 2',
                'name' => 'smriti_option_2',
                'type' => 'text',
                'instructions' => 'Second quiz option',
                'required' => 1,
            ),
            
            array(
                'key' => 'field_smriti_option_3',
                'label' => 'Option 3',
                'name' => 'smriti_option_3',
                'type' => 'text',
                'instructions' => 'Third quiz option (optional)',
            ),
            
            array(
                'key' => 'field_smriti_option_4',
                'label' => 'Option 4',
                'name' => 'smriti_option_4',
                'type' => 'text',
                'instructions' => 'Fourth quiz option (optional)',
            ),
            
            array(
                'key' => 'field_smriti_correct_answer',
                'label' => 'Correct Answer',
                'name' => 'smriti_correct_answer',
                'type' => 'radio',
                'instructions' => 'Select which option is the correct answer',
                'required' => 1,
                'choices' => array(
                    '1' => 'Option 1',
                    '2' => 'Option 2',
                    '3' => 'Option 3',
                    '4' => 'Option 4',
                ),
                'default_value' => '1',
                'layout' => 'vertical',
            ),

            
            // Manana Card Tab
            array(
                'key' => 'field_tab_manana',
                'label' => 'Manana (Reflection)',
                'type' => 'tab',
            ),
            
            array(
                'key' => 'field_manana_prompt',
                'label' => 'Reflection Prompt',
                'name' => 'manana_prompt',
                'type' => 'textarea',
                'instructions' => 'Prompt for user reflection',
                'rows' => 4,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'daily_sadhana',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ));
}
