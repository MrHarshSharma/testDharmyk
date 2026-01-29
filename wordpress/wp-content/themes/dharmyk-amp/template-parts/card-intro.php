<?php
/**
 * Card Template: Intro
 * 
 * Welcome card with title, description, and image
 */

$intro_title = dharmyk_get_field('intro_title');
$intro_description = dharmyk_get_field('intro_description');
$intro_image = dharmyk_get_field('intro_image_url');
$theme = dharmyk_get_field('theme');
?>

<div class="card-container">
    <div class="content-wrapper">
        <?php if ($intro_image): ?>
            <h1 class="text-center"><?php echo esc_html($intro_title ?: 'Welcome to Your Sadhana'); ?></h1>

            <?php if ($theme): ?>
                <p class="text-center" style="color: var(--color-saffron); font-weight: 600; text-transform: capitalize; letter-spacing: 0.5px; font-size: 1rem; margin-top: -0.5rem; margin-bottom: 2rem;">
                    <?php echo esc_html($theme); ?>
                </p>
            <?php endif; ?>
        
            <amp-img 
                src="<?php echo esc_url($intro_image); ?>" 
                width="400" 
                height="300" 
                layout="responsive"
                alt="<?php echo esc_attr($intro_title); ?>">
            </amp-img>
        <?php endif; ?>
        
        <?php if ($intro_description): ?>
            <p class="text-center" style="margin-top: 1.5rem; margin-bottom: 2rem; color: #555;"><?php echo esc_html($intro_description); ?></p>
        <?php endif; ?>
        
        <div class="btn-container" style="justify-content: center; margin-top: 1rem;">
            <a href="dharmyk://next" class="btn">Begin Journey</a>
        </div>
    </div>
</div>
