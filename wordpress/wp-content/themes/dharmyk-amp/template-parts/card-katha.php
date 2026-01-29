<?php
/**
 * Card Template: Katha (Story)
 * 
 * Displays story with title, image, and content
 */

$katha_title = dharmyk_get_field('katha_title');
$katha_content = dharmyk_get_field('katha_content');
$katha_image = dharmyk_get_field('katha_image_url');
?>

<div class="card-container">
    <div class="content-wrapper">
        <h2 class="text-center"><?php echo esc_html($katha_title ?: 'Today\'s Story'); ?></h2>
        
        <?php if ($katha_image): ?>
            <amp-img 
                src="<?php echo esc_url($katha_image); ?>" 
                width="400" 
                height="300" 
                layout="responsive"
                alt="<?php echo esc_attr($katha_title); ?>">
            </amp-img>
        <?php endif; ?>
        
        <?php if ($katha_content): ?>
            <div class="story-content">
                <?php echo wp_kses_post($katha_content); ?>
            </div>
        <?php endif; ?>
        
        <div class="btn-container">
            <a href="dharmyk://back" class="btn btn-secondary">Back</a>
            <a href="dharmyk://next" class="btn">Continue</a>
        </div>
    </div>
</div>
