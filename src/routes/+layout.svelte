<script>
	import '@picocss/pico/css/pico.min.css';
	import 'katex/dist/katex.min.css'; // <-- ENSURE THIS LINE IS HERE AND ACTIVE
	import '../theme.css';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Testsolve App</title>
</svelte:head>

<header class="container-fluid">
	<div class="container header-content">
		<a href="/" class="site-title">
			<hgroup>
				<h1>Testsolve</h1>
				<h2>TJ Varsity Math Team</h2>
			</hgroup>
		</a>

		{#if $page.data.user}
			<nav class="desktop-nav">
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/propose">Propose</a></li>
					<li><a href="/logout" role="button" class="contrast outline">Logout</a></li>
				</ul>
			</nav>
		{/if}
	</div>
</header>

<main class="container">
	<slot />
</main>

<style>
	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.site-title {
		text-decoration: none;
	}

	.site-title hgroup {
		margin: 0;
	}

	.site-title h1 {
		margin: 0;
		font-size: 1.75rem;
		color: var(--primary); /* Use accent color for title */
	}

	.site-title h2 {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted-color);
		text-align: left; /* Override global center alignment */
	}

	/* Styling for the new 1x3 navigation grid */
	.desktop-nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		gap: 1.5rem; /* Space between nav items */
	}

	.desktop-nav a {
		font-weight: 500;
		text-decoration: none;
	}

	/* The "Propose Question" link is no longer in the navbar text (Request #5)
	   but is now part of the nav block (Request #6) */
</style>