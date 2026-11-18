<template>
	<div class="plus-grid" aria-hidden="true">
		<span class="plus-grid__cell plus-grid__cell--left" />
		<span class="plus-grid__cell plus-grid__cell--right" />
	</div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
// Two fixed marks, vertically centred on the left and right edges.
.plus-grid {
	--mark: '+';
	--mark-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	--mark-size: 1.9vw;
	--mark-weight: 300;
	@media (max-width: $break-s) {
		--mark-size: 3vh;
	}

	position: fixed;
	inset: 0;
	z-index: 100;
	pointer-events: none;
	user-select: none;
	color: rgb(255 255 255 / 60%);

	&__cell {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);

		&--left {
			left: var(--edge);
		}

		&--right {
			right: var(--edge);
		}

		&::before {
			display: block;
			content: var(--mark);
			font-family: var(--mark-font);
			font-size: var(--mark-size);
			font-weight: var(--mark-weight);
			line-height: 1;
			letter-spacing: 0;
		}
	}
}

@media print {
	.plus-grid {
		display: none;
	}
}
</style>
