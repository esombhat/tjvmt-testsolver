<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import katex from 'katex';

	export let form: ActionData;

	// This variable is bound to the textarea, acting as our single source of truth.
	let questionBody = '';

	/**
	 * This is our robust KaTeX rendering action.
	 * It now powers the live preview.
	 * @param {HTMLElement} node The element to render into.
	 * @param {string} textContent The raw string from the textarea.
	 */
	function renderMath(node: HTMLElement, textContent: string) {
		const render = (text: string) => {
			if (text === undefined) {
				node.innerHTML = ''; // Clear the preview if text is undefined
				return;
			}
			// The old reactive block (`$:`) and intermediate `renderedPreview` variable are no longer needed.
			const blockRendered = text.replace(/\$\$(.*?)\$\$/gs, (match, latex) => {
				return katex.renderToString(latex, { displayMode: true, throwOnError: false });
			});
			const inlineRendered = blockRendered.replace(/\$(.*?)\$/g, (match, latex) => {
				return katex.renderToString(latex, { displayMode: false, throwOnError: false });
			});
			node.innerHTML = inlineRendered;
		};

		render(textContent); // Initial render on mount

		return {
			// This 'update' method automatically runs whenever `questionBody` changes.
			update(newTextContent: string) {
				render(newTextContent);
			}
		};
	}
</script>

<article>
	<header>
		<h1>Propose a New Question</h1>
	</header>
<form method="POST" action="?/create" use:enhance>
    <label for="title">
        Question Title
        <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g. A Classic Divisibility Problem"
            required
        />
    </label>

	<label for="body">
		Question Body
		<textarea
			id="body"
			name="body"
			rows="8"
			placeholder="Write your question here. Use $...$ for inline LaTeX and $$...$$ for block LaTeX."
			bind:value={questionBody}
		></textarea>
	</label>

	<div class="preview-container">
		<h6>Live Preview</h6>
		<div class="preview-content" use:renderMath={questionBody} />
	</div>

    <label for="solution">
        Solution (Optional)
        <textarea
            id="solution"
            name="solution"
            rows="6"
            placeholder="Explain the solution. You can also use LaTeX here."
        ></textarea>
    </label>

	<div class="grid">
		<label for="answer">Correct Answer <input type="text" id="answer" name="answer" required /></label>
		<label for="timer">Timer (seconds) <input type="number" id="timer" name="timer" value="900" /></label>
	</div>

	<label for="tags">
		Tags
		<input type="text" id="tags" name="tags" placeholder="e.g. algebra, number theory" />
		<small>Separate tags with a comma.</small>
	</label>

	{#if form?.error}
		<p class="error-message">{form.error}</p>
	{/if}

	<button type="submit" class="contrast">Submit Question</button>
</form>
</article>

<style>
	.preview-container {
		margin-bottom: 1.5rem;
	}
	.preview-content {
		background-color: var(--background-color);
		border: 1px solid var(--muted-border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
		min-height: 5rem;
		font-size: var(--font-size);
		line-height: var(--line-height);
	}
	.error-message {
		color: var(--primary);
	}
	h1 {
		margin-bottom: 0;
	}
</style>