<?php
/**
 * Card Template: Manana (Reflection)
 * 
 * Reflection form with textarea for user input
 */

$manana_prompt = dharmyk_get_field('manana_prompt');
?>

<div class="card-container">
    <h2 class="text-center">Reflect & Contemplate</h2>
    
    <?php if ($manana_prompt): ?>
        <div class="reflection-prompt">
            <?php echo esc_html($manana_prompt); ?>
        </div>
    <?php endif; ?>
    
    <form 
        class="reflection-form" 
        method="GET" 
        action="dharmyk://save_reflection"
        target="_top">
        
        <textarea 
            name="reflection" 
            placeholder="Share your thoughts..."
            required
            minlength="10"></textarea>
        
        <div class="text-center">
            <button type="submit" class="btn">Complete Sadhana</button>
        </div>
    </form>
</div>
