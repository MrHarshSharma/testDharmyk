<?php
/**
 * Card Template: Shloka (Verse)
 * 
 * Displays Sanskrit verse, translation, and audio player
 */

$shloka_text = dharmyk_get_field('shloka_text');
$shloka_translation = dharmyk_get_field('shloka_translation');
$shloka_audio = dharmyk_get_field('shloka_audio_url');
?>

<div class="card-container">
    <h2 class="text-center">Today's Verse</h2>
    
    <?php if ($shloka_text): ?>
        <div class="sanskrit">
            <?php echo nl2br(esc_html($shloka_text)); ?>
        </div>
    <?php endif; ?>
    
    <?php if ($shloka_audio): ?>
        <div class="audio-container">
            <audio 
                src="<?php echo esc_url($shloka_audio); ?>" 
                controls
                style="width: 100%; max-width: 400px; height: 50px;"
            >
                <p>Your browser doesn't support audio playback.</p>
            </audio>
        </div>
    <?php endif; ?>
    
    <?php if ($shloka_translation): ?>
        <div class="translation">
            <?php echo nl2br(esc_html($shloka_translation)); ?>
        </div>
    <?php endif; ?>
    
    <div class="mt-2 text-center">
        <a href="dharmyk://next" class="btn">Continue</a>
    </div>
</div>
