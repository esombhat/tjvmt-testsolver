<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let ratingValue = 3;
	const ratingLabels = ['Very Easy', 'Easy', 'Just Right', 'Hard', 'Very Hard'];
</script>

<article>
	<header>
		<div class="result-card" class:correct={data.attempt.isCorrect}>
			{#if data.attempt.isCorrect}
				<h3>Correct!</h3>
			{:else}
				<h3>Incorrect</h3>
				<p>The correct answer was: <strong>{data.question.answer}</strong></p>
			{/if}
		</div>

		<h1>Rate this Problem</h1>
		<p>Your feedback helps us select better questions.</p>
	</header>

	<form method="POST">
		<label for="rating">
			Difficulty Rating:
			<strong class="rating-display">{ratingLabels[ratingValue - 1]} ({ratingValue}/5)</strong>
		</label>
		<input
			type="range"
			id="rating"
			name="rating"
			min="1"
			max="5"
			step="1"
			bind:value={ratingValue}
		/>

		<button type="submit" class="contrast">Submit Rating and Go to Discussion</button>
	</form>
</article>

<style>
	/* --- NEW STYLES for the result card --- */
	.result-card {
		padding: 1rem;
		border-radius: var(--border-radius);
		margin-bottom: 2rem;
		color: var(--text-primary);
	}
	.result-card.correct {
		background-color: #166534; /* Green */
	}
	.result-card:not(.correct) {
		background-color: #991b1b; /* Red */
	}
	.result-card h3 {
		margin-bottom: 0.5rem;
	}
	.result-card p {
		margin: 0;
	}

	.rating-display {
		display: inline-block;
		background-color: var(--primary);
		color: var(--primary-inverse);
		padding: 0.1rem 0.5rem;
		border-radius: var(--border-radius);
		min-width: 120px;
		text-align: center;
	}
</style>