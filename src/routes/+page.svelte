<!-- /src/routes/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery = '';
	let filteredTags: typeof data.allTags = [];
	let isSearchFocused = false;

	$: {
		if (searchQuery && isSearchFocused) {
			filteredTags = data.allTags.filter((tag) =>
				tag.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			filteredTags = [];
		}
	}

	function createSnippet(html: string) {
		const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
		return text.length > 200 ? text.substring(0, 200) + '...' : text;
	}

	function handleBlur() {
		setTimeout(() => {
			isSearchFocused = false;
		}, 150);
	}
</script>

<header class="grid">
	<div><h1 class="mb-0">Question Dashboard</h1></div>
	<div class="flex justify-end">
		<a href="/propose" role="button" class="contrast w-auto">Propose Question</a>
	</div>
</header>

<hr />

<!-- ====== Tag Search Section ====== -->
<section>
	<label for="tag-search">
		Filter by Tag
		<div style="position: relative;">
			<input
				id="tag-search"
				type="search"
				bind:value={searchQuery}
				on:focus={() => (isSearchFocused = true)}
				on:blur={handleBlur}
				placeholder="Search for tags like 'algebra' or 'geometry'..."
			/>
			{#if filteredTags.length > 0}
				<div class="dropdown">
					<ul>
						{#each filteredTags as tag}
							<li>
								<a href="/?tag={tag.name}" on:mousedown|preventDefault>{tag.name}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</label>

	{#if data.selectedTag}
		<div class="mt-4">
			<span class="tag">
				Filtering by: {data.selectedTag}
				<a href="/" class="clear-link" title="Clear filter">&times;</a>
			</span>
		</div>
	{/if}
</section>

<!-- ====== Question List Section ====== -->
{#if data.questions.length > 0}
	{#each data.questions as question (question.id)}
<a href="/question/{question.id}" class="card-link">
    <article>
        <h3 class="card-title">{question.title}</h3>
        <footer class="grid">
            <div>
                {#each question.tags as tag}
                    <small class="tag">{tag.name}</small>
                {/each}
            </div>
            <div class="text-right">
                <small>by {question.author.name}</small>
            </div>
        </footer>
    </article>
</a>
	{/each}
{:else}
	<div class="text-center py-16">
		<h3>No Questions Found</h3>
		<p>
			{#if data.selectedTag}
				There are no questions with the tag "{data.selectedTag}".
			{:else}
				Be the first to propose one!
			{/if}
		</p>
	</div>
{/if}

<style>
	/* Some additional styles to fine-tune the look */
	.grid {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 1rem;
	}
	.flex {
		display: flex;
	}
	.justify-end {
		justify-content: flex-end;
	}
	.mb-0 {
		margin-bottom: 0;
	}
	.w-auto {
		width: auto;
	}
	.text-right {
		text-align: right;
	}
	.text-center {
		text-align: center;
	}
	.py-16 {
		padding-top: 4rem;
		padding-bottom: 4rem;
	}
	.mt-4 {
		margin-top: 1rem;
	}
		label[for='tag-search'] > div {
		margin-top: 0.5rem; /* Adjust this value if you want more/less space */
	}

	/* Styles for the search dropdown */
	.dropdown {
		position: absolute;
		width: 100%;
		z-index: 10;
		background: var(--card-background-color);
		border: 1px solid var(--muted-border-color);
		border-radius: var(--border-radius);
		margin-top: 0.25rem;
		max-height: 15rem;
		overflow-y: auto;
	}
	.dropdown ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.dropdown a {
		display: block;
		padding: 0.5rem 1rem;
		color: var(--color);
	}
	.dropdown a:hover {
		background: var(--primary);
		color: var(--primary-inverse);
	}
	.card-link {
		text-decoration: none;
	}
	.card-link article {
		/* Reduced padding */
		padding: 1rem;
		transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		border: 1px solid var(--muted-border-color);
	}
	.card-link:hover article {
		transform: translateY(-4px);
		border-color: var(--primary-focus);
		box-shadow: var(--card-box-shadow);
	}
	.card-title {
    text-align: left; /* Override global center alignment for card titles */
    margin-bottom: 1rem;
	}
	/* Reduce the snippet text size */
	.card-link p {
		font-size: 0.9rem;
		margin-bottom: 1rem;
		color: var(--muted-color);
	}

	/* Reduce the tag size */
	.tag {
		display: inline-block;
		background-color: rgba(255, 102, 135, 0.1);
		color: #ff6687;
		padding: 0.15rem 0.4rem; /* Reduced padding */
		border-radius: 999px;
		font-size: 0.7rem; /* Reduced font size */
		margin-right: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.clear-link {
		color: #ff6687;
		text-decoration: none;
		font-weight: bold;
		margin-left: 0.5rem;
	}
	
</style>