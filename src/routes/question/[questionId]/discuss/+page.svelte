<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import katex from 'katex';

	export let data: PageData;

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
</script>

<a href="/">&larr; Back to Dashboard</a>

<article class="question-display">
	<header>
		<h2>Question</h2>
	</header>
	<div use:renderMath={data.question.body} />
</article>

<article>
	<header>
		<h2>Answer & Solution</h2>
	</header>
	<p><strong>Correct Answer:</strong> {data.question.answer}</p>
	{#if data.question.solution}
		<hr />
		<div use:renderMath={data.question.solution} />
	{:else}
		<p><em>No official solution was provided for this problem.</em></p>
	{/if}
</article>

<section>
	<h2>Discussion</h2>
	<div class="discussion-container">
		{#each data.messages as message (message.id)}
			<div class="comment">
				<div class="comment-header">
					<strong>{message.user.name || message.user.email}</strong>
					<small>
						{new Date(message.createdAt).toLocaleString('en-US', {
							dateStyle: 'short',
							timeStyle: 'short'
						})}
					</small>
				</div>
				<p use:renderMath={message.content}></p>
			</div>
		{:else}
			<p><em>No comments yet. Be the first to say something!</em></p>
		{/each}
	</div>

	<form
		method="POST"
		action="?/addComment"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
		class="mt-4"
	>
		<textarea name="comment" placeholder="Write your comment..." required></textarea>
		<button type="submit" class="contrast">Post Comment</button>
	</form>
</section>

<style>
	/* ... Styles are the same ... */
	.question-display {
		background-color: var(--card-background-color);
		border: 1px solid var(--card-border-color);
		border-radius: var(--border-radius);
		padding: 1rem 1.5rem;
		margin-top: 1rem;
	}
	.discussion-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.comment {
		background-color: var(--card-background-color);
		border-left: 3px solid var(--primary);
		padding: 0.75rem 1.25rem;
		border-radius: var(--border-radius);
	}
	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		color: var(--muted-color);
	}
	.comment-header strong {
		color: var(--color);
	}
	.comment p {
		margin: 0;
		white-space: pre-wrap;
	}
	.mt-4 {
		margin-top: 1rem;
	}
</style>