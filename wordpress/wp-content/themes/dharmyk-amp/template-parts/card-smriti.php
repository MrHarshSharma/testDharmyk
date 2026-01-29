<?php
/**
 * Card Template: Smriti (Quiz)
 * 
 * Interactive quiz card with multiple choice options
 */

$question = dharmyk_get_field('smriti_question');
$option_1 = dharmyk_get_field('smriti_option_1');
$option_2 = dharmyk_get_field('smriti_option_2');
$option_3 = dharmyk_get_field('smriti_option_3');
$option_4 = dharmyk_get_field('smriti_option_4');
$correct_answer = dharmyk_get_field('smriti_correct_answer');

// Build options array
$options = array();
if ($option_1) $options[] = array('text' => $option_1, 'index' => 1);
if ($option_2) $options[] = array('text' => $option_2, 'index' => 2);
if ($option_3) $options[] = array('text' => $option_3, 'index' => 3);
if ($option_4) $options[] = array('text' => $option_4, 'index' => 4);
?>

<div class="card-container">
    <h2 class="text-center">Test Your Knowledge</h2>
    
    <?php if ($question && !empty($options)): ?>
        <div class="quiz-container">
            <p class="quiz-question"><?php echo esc_html($question); ?></p>
            
            <amp-state id="quizState">
                <script type="application/json">
                {
                    "selectedAnswer": "",
                    "correctAnswer": "<?php echo esc_js($correct_answer); ?>",
                    "answered": false
                }
                </script>
            </amp-state>
            
            <?php foreach ($options as $option): ?>
                <button 
                    class="quiz-option"
                    [class]="quizState.answered && '<?php echo $option['index']; ?>' == quizState.correctAnswer ? 'quiz-option correct' : (quizState.answered && quizState.selectedAnswer == '<?php echo $option['index']; ?>' ? 'quiz-option incorrect' : 'quiz-option')"
                    on="tap:AMP.setState({
                        quizState: {
                            selectedAnswer: '<?php echo $option['index']; ?>',
                            correctAnswer: '<?php echo esc_js($correct_answer); ?>',
                            answered: true
                        }
                    })"
                    [disabled]="quizState.answered"
                >
                    <?php echo esc_html($option['text']); ?>
                </button>
            <?php endforeach; ?>
            
            <div 
                class="mt-2 text-center"
                [hidden]="!quizState.answered"
            >
                <p [hidden]="quizState.selectedAnswer != quizState.correctAnswer">
                    🎉 Correct! Well done!
                </p>
                <p [hidden]="quizState.selectedAnswer == quizState.correctAnswer">
                    Not quite. The correct answer is Option <?php echo esc_html($correct_answer); ?>.
                </p>
            </div>
        </div>
    <?php else: ?>
        <p class="text-center">Quiz not available.</p>
    <?php endif; ?>
    
    <div class="mt-2">
        <a href="dharmyk://next" class="btn">Continue</a>
    </div>
</div>
