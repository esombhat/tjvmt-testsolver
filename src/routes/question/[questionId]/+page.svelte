<script lang="ts">
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import katex from 'katex';
	import type { PageData } from './$types';

	export let data: PageData;

	// --- NEW: State variable to control the UI ---
	let hasStarted = false;

	let timeLeft = data.question.timerDuration;
	let timerInterval: NodeJS.Timeout;

	// --- UPDATED: Simplified startTimer function ---
	function startTimer() {
		hasStarted = true; // This now controls the UI switch
		timerInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				clearInterval(timerInterval);
				document.querySelector<HTMLFormElement>('#solve-form')?.requestSubmit();
			}
		}, 1000);
	}

	function renderMath(node: HTMLElement, textContent: string) {
		const render = (text: string) => {
			if (text === undefined) return;
			const blockRendered = text.replace(/\$\$(.*?)\$\$/gs, (match, latex) => {
				return katex.renderToString(latex, { displayMode: true, throwOnError: false });
			});
			const inlineRendered = blockRendered.replace(/\$(.*?)\$/g, (match, latex) => {
				return katex.renderToString(latex, { displayMode: false, throwOnError: false });
			});
			node.innerHTML = inlineRendered;
		};
		render(textContent);
		return {
			update(newTextContent: string) {
				render(newTextContent);
			}
		};
	}

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});
</script>

<a href="/">&larr; Back to Dashboard</a>

<header>
	<h1>Problem Attempt</h1>
	<p>Proposed by {data.question.author.name}</p>
</header>

<hr />

<div class="relative-container">
	{#if !hasStarted}
		<div class="overlay">
			<p>Time Limit: {Math.floor(data.question.timerDuration / 60)} minutes</p>
			<button on:click={startTimer}>Start</button>
		</div>
	{/if}

	<article use:renderMath={data.question.body} class="question-body" />

	{#if hasStarted}
		<div class="timer">
			{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
		</div>
	{/if}
</div>

{#if hasStarted}
	<section>
		<form id="solve-form" method="POST" action="?/submitAnswer" use:enhance>
			<label for="answer">Your Answer</label>
			<input type="text" name="answer" id="answer" placeholder="Enter your answer..." required />
			<button type="submit" class="contrast">Submit</button>
		</form>
	</section>
{/if}

<style>
	header {
		text-align: center;
	}
	header p {
		color: var(--muted-color);
		margin-top: -1rem;
	}
	.relative-container {
		position: relative;
	}
	.overlay {
		position: absolute;
		inset: 0;
		background-color: rgba(10, 29, 47, 0.5); /* Semi-transparent version of your bg */
		backdrop-filter: blur(8px);
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: var(--border-radius);
		border: 1px solid var(--muted-border-color);
	}
	.overlay p {
		font-size: 1.2rem;
		font-weight: 500;
	}
	.question-body {
		background-color: var(--card-background-color);
		padding: 1.5rem;
		border-radius: var(--border-radius);
		min-height: 10rem;
	}
	.timer {
		margin-top: 1rem;
		text-align: center;
		font-size: 2rem;
		font-family: monospace;
		color: var(--primary);
	}
</style>