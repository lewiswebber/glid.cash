<script setup>
const props = defineProps({
	contents: {
		type: Object,
		required: true
	}
})

// Tweakable settings. Scroll distances are in screens (1 = 100svh).
const settings = {
	// Scroll held on the first and last slide, before and after the slideshow moves.
	hold: 0.2,
	// Scroll it takes to move from one slide to the next.
	perSlide: 1,
	// Text cross-fade: share of a slide step it takes to fade out (0.5 = gone halfway).
	textFade: 0.5,
	// Text vertical drift per slide step, in svh.
	textDrift: 4,
	// Phone screen position and size, as % of the image column height (Figma: 11 and 97).
	screenTop: 11,
	screenHeight: 97,
	// Desktop entrance: scale from this as the section comes into view...
	enterScale: 0.9,
	// ...reaching full size when its top is this % down the viewport.
	enterEnd: 50
}

const root = ref(null)
const sticky = ref(null)
const count = computed(() => props.contents.slides.length)

const style = computed(() => ({
	'--count': count.value,
	'--hold': settings.hold,
	'--per-slide': settings.perSlide,
	'--text-fade': settings.textFade,
	'--text-drift': `${settings.textDrift}svh`,
	'--screen-top': settings.screenTop,
	'--screen-height': settings.screenHeight,
	'--enter-scale': settings.enterScale,
	'--enter-end': `${100 - settings.enterEnd}%`
}))

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const last = computed(() => count.value - 1)
// Section scroll in screens: the slide steps plus a hold at either end.
const scrollLength = computed(() => last.value * settings.perSlide + 2 * settings.hold)

// Slide position (0 → last) as a share of the section's scroll, and back.
const progressAt = position => (settings.hold + clamp(position, 0, last.value) * settings.perSlide) / scrollLength.value
const positionAt = progress => clamp((progress * scrollLength.value - settings.hold) / settings.perSlide, 0, last.value)

// CSS scroll-driven ranges, as a % of the section's 'contain' range.
const percent = position => `${(progressAt(position) * 100).toFixed(3)}%`

// Slide i wipes in while the position goes from i - 1 to i.
const slideStyle = index => ({
	'--i': index,
	'--range-start': percent(index - 1),
	'--range-end': percent(index)
})

// Text i fades in over [i - textFade, i] and out over [i, i + textFade]; the first only fades out, the last only in.
const textStyle = index => ({
	'--i': index,
	'--range-start': percent(index === 0 ? 0 : index - settings.textFade),
	'--range-end': percent(index === last.value ? index : index + settings.textFade)
})

// Progress: the fill grows from empty (first slide) to full (last); each number shows from half a slide before to half after.
const fillStyle = computed(() => ({
	'--range-start': percent(0),
	'--range-end': percent(last.value)
}))

const countStyle = index => ({
	'--i': index,
	'--range-start': percent(index - 0.5),
	'--range-end': percent(index + 0.5)
})

const pad = number => String(number).padStart(2, '0')

// JS fallback for browsers without CSS scroll-driven animations.
// Geometry is measured only when layout changes, so each scroll frame reads just scrollY.
let start = 0
let range = 0
let current = ''
let frame = 0
let resizeObserver

function measure() {
	const section = root.value
	if (!section || !sticky.value) return
	start = section.getBoundingClientRect().top + window.scrollY
	// The sticky's 100svh, not innerHeight, which changes with mobile toolbars.
	range = section.offsetHeight - sticky.value.offsetHeight
	update()
}

// Writes the slide position (0 → count - 1) as --s; CSS derives every transform and fade from it.
function update() {
	frame = 0
	const section = root.value
	if (!section) return
	const progress = range > 0 ? clamp((window.scrollY - start) / range, 0, 1) : 0
	const position = positionAt(progress)
	const value = position.toFixed(4)
	// Skip the style write (and recalc) while pinned on a hold or outside the section.
	if (value === current) return
	current = value
	section.style.setProperty('--s', value)
	section.style.setProperty('--index', Math.round(position))
}

const schedule = () => {
	if (!frame) frame = requestAnimationFrame(update)
}

onMounted(() => {
	// CSS view timelines drive everything (see styles); no scroll handling needed.
	if (CSS.supports('animation-timeline: view()')) return
	// Content above (fonts, text splitting) can move the section without resizing it,
	// so observe the whole document as well as the section.
	resizeObserver = new ResizeObserver(measure)
	resizeObserver.observe(document.documentElement)
	resizeObserver.observe(root.value)
	// Cheap per frame: one scrollY read, and no style write unless the position changed.
	window.addEventListener('scroll', schedule, { passive: true })
	measure()
})

onBeforeUnmount(() => {
	cancelAnimationFrame(frame)
	window.removeEventListener('scroll', schedule)
	resizeObserver?.disconnect()
})
</script>

<template>
	<section ref="root" class="design" aria-labelledby="design-title" :style="style">
		<div ref="sticky" class="design__sticky">
			<div class="design__media">
				<div v-for="(slide, index) in contents.slides" :key="slide.screen" class="design__slide" :style="slideStyle(index)">
					<div class="design__layer" :style="{ '--from': slide.gradient[0], '--via': slide.gradient[1] }">
						<picture class="design__phone">
							<source :srcset="`/img/design/${slide.screen}.avif`" type="image/avif">
							<img :src="`/img/design/${slide.screen}.jpg`" width="804" height="1748" :alt="slide.alt" fetchpriority="low" decoding="async">
						</picture>
					</div>
				</div>
			</div>
			<div class="design__card">
				<h2 id="design-title" class="design__label monospace opacity__50" data-splitting effect__titleRandom>{{ contents.subtitle }}</h2>
				<div class="design__texts">
					<article v-for="(slide, index) in contents.slides" :key="slide.title" class="design__text" :class="{ 'design__text--first': index === 0, 'design__text--last': index === last }" :style="textStyle(index)">
						<h3 class="text-lead">{{ slide.title }}</h3>
						<div class="design__description monospace opacity__50">
							<p v-for="paragraph in slide.paragraphs" :key="paragraph">{{ paragraph }}</p>
						</div>
					</article>
				</div>
				<div class="design__progress monospace" aria-hidden="true">
					<span class="design__count opacity__50">
						<span v-for="(slide, index) in contents.slides" :key="slide.screen" class="design__count-number" :class="{ 'design__count-number--first': index === 0, 'design__count-number--last': index === last }" :style="countStyle(index)">{{ pad(index + 1) }}</span>
					</span>
					<span class="design__bar">
						<span class="design__bar-fill" :style="fillStyle" />
					</span>
					<span class="opacity__50">{{ pad(count) }}</span>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

/*
Desktop sizes from the Figma 1665 frame, in vw.
--s is the current slide position; --d is each slide's distance from it (0 = in view).
*/
.design {
	--s: 0;
	--index: 0;
	--gap: 1.2vw;
	position: relative;
	// The sticky screen, plus the scroll between slides and the hold at either end.
	height: calc((1 + (var(--count) - 1) * var(--per-slide) + 2 * var(--hold)) * 100svh);
	background: var(--bgcolor);

	&__sticky {
		position: sticky;
		top: 0;
		display: grid;
		grid-template-columns: 513fr 1097fr;
		gap: var(--gap);
		height: 100svh;
		padding: var(--gap);
	}

	&__media,
	&__card {
		border-radius: var(--radius-l);
	}

	/*
	Image column: a wipe. Each incoming slide's frame rises from the bottom while its
	content is held still by an equal and opposite offset, so the next screen is revealed
	in place. Both are compositor-only transforms; nothing repaints while scrolling.
	--reveal is 1 below the view, 0 once shown, so earlier slides stay put underneath.
	*/
	&__media {
		position: relative;
		grid-column: 2;
		grid-row: 1;
		overflow: hidden;
		// Keeps the rounded clip on transformed children in Safari.
		isolation: isolate;
		container-type: size;
		contain: strict;
		background: #000;
	}

	&__slide {
		--reveal: clamp(0, calc(var(--i) - var(--s)), 1);
		position: absolute;
		inset: 0;
		overflow: hidden;
		transform: translate3d(0, calc(var(--reveal) * 100%), 0);
		will-change: transform;
	}

	&__layer {
		position: absolute;
		inset: 0;
		background: linear-gradient(195deg, var(--from) 0%, var(--via) 49.5%, #000 109.6%);
		transform: translate3d(0, calc(var(--reveal) * -100%), 0);
		will-change: transform;
	}

	// Figma: 402 × 874 phone, 99px from the top of a 900px slide, 60px corners.
	&__phone {
		position: absolute;
		top: calc(var(--screen-top) * 1cqh);
		right: 0;
		left: 0;
		width: calc(var(--screen-height) * 1cqh * 402 / 874);
		height: calc(var(--screen-height) * 1cqh);
		margin: 0 auto;
		overflow: hidden;
		border-radius: calc(var(--screen-height) * 1cqh * 60 / 874);

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	/* Text column. */
	&__card {
		display: flex;
		flex-direction: column;
		grid-column: 1;
		grid-row: 1;
		min-height: 0;
		padding: 2vw 4.4vw 3.1vw;
		background: var(--card);
	}

	&__label {
		margin-bottom: 4.5vw;
	}

	// Slides share one cell, so the column fits the tallest.
	&__texts {
		display: grid;
		flex: 1;
	}

	// Cross-fade: fully visible at --d 0, gone --text-fade of a slide away.
	&__text {
		--d: calc(var(--i) - var(--s));
		display: flex;
		flex-direction: column;
		grid-area: 1 / 1;
		opacity: max(0, calc(1 - max(var(--d), -1 * var(--d)) / var(--text-fade)));
		transform: translate3d(0, calc(var(--d) * var(--text-drift)), 0);
	}

	&__description {
		width: 17.6vw;
		margin-top: auto;

		p + p {
			margin-top: 1.2em;
		}
	}

	// Figma: "01 —— 04" along the card bottom; white 30% track, white fill.
	&__progress {
		display: flex;
		align-items: center;
		gap: 1em;
		margin-top: 8.2vw;
	}

	// Numbers share one cell; only the current slide's shows.
	&__count {
		display: grid;
	}

	&__count-number {
		grid-area: 1 / 1;
		opacity: calc(1 - min(1, max(var(--i) - var(--index), var(--index) - var(--i))));
	}

	&__bar {
		position: relative;
		flex: 1;
		height: 1px;
		overflow: hidden;
		background: rgb(255 255 255 / 30%);
	}

	&__bar-fill {
		position: absolute;
		inset: 0;
		background: #fff;
		transform: scaleX(calc(var(--s) / max(1, var(--count) - 1)));
		transform-origin: left;
	}

	// Reduced motion: slides and text cross-fade in place.
	@media (prefers-reduced-motion: reduce) {
		&__slide {
			opacity: calc(1 - var(--reveal));
		}

		&__slide,
		&__layer,
		&__text {
			transform: none;
		}
	}

	/*
	Where supported, the same motion runs as CSS animations on a view timeline of the section.
	The browser keeps these in step with the real scroll, including while iOS Safari's toolbar
	resizes, where JS scroll handlers lag and jitter. The --s rules above are the fallback.
	'contain' runs from the section top reaching the viewport top to its bottom reaching the
	bottom; each element's --range-start/--range-end is set in the script.
	*/
	@supports (animation-timeline: view()) {
		view-timeline: --design block;

		&__slide,
		&__layer,
		&__text,
		&__count-number,
		&__bar-fill {
			animation-duration: auto;
			animation-timing-function: linear;
			animation-fill-mode: both;
			animation-timeline: --design;
			animation-range: contain var(--range-start) contain var(--range-end);
		}

		// The first slide is already in place.
		&__slide + &__slide {
			animation-name: design-wipe;
		}

		&__slide + &__slide &__layer {
			animation-name: design-wipe-layer;
		}

		&__text {
			animation-name: design-text;

			&--first {
				animation-name: design-text-out;
			}

			&--last {
				animation-name: design-text-in;
			}

			&--first#{&}--last {
				animation-name: none;
			}
		}

		&__bar-fill {
			animation-name: design-fill;
		}

		// Each number is shown only during its own range; the first and last hold beyond theirs.
		&__count-number {
			opacity: 0;
			animation-name: design-count;
			animation-fill-mode: none;

			&--first {
				animation-fill-mode: backwards;
			}

			&--last {
				animation-fill-mode: forwards;
			}
		}

		// Desktop entrance: from "section top at viewport bottom" to "top at --enter-end".
		@media (min-width: ($break-s + 1px)) and (prefers-reduced-motion: no-preference) {
			&__sticky {
				transform-origin: 50% 0;
				animation: design-enter linear both;
				animation-timeline: --design;
				animation-range: entry 0% entry var(--enter-end);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			&__slide + &__slide {
				animation-name: design-fade-in;
			}

			&__slide + &__slide &__layer {
				animation-name: none;
			}

			&__text {
				--text-drift: 0svh;
			}
		}
	}

	/* Mobile: image above text, clear of the bottom nav. */
	@media (max-width: $break-s) {
		--gap: 10px;

		&__sticky {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(0, 1fr) auto;
			padding-bottom: calc(var(--gap) * 2 + 50px + env(safe-area-inset-bottom));
		}

		&__media {
			grid-column: 1;
			grid-row: 1;
		}

		&__card {
			grid-row: 2;
			padding: 20px;
		}

		&__label {
			margin-bottom: 20px;
		}

		&__description {
			width: 100%;
			margin-top: 20px;

			// First paragraph only, so the card fits smaller phones.
			p + p {
				display: none;
			}
		}

		&__progress {
			margin-top: 20px;
		}
	}
}

@keyframes design-wipe {
	from {
		transform: translate3d(0, 100%, 0);
	}

	to {
		transform: translate3d(0, 0, 0);
	}
}

@keyframes design-wipe-layer {
	from {
		transform: translate3d(0, -100%, 0);
	}

	to {
		transform: translate3d(0, 0, 0);
	}
}

@keyframes design-enter {
	from {
		opacity: 0;
		transform: scale(var(--enter-scale));
	}

	to {
		opacity: 1;
		transform: none;
	}
}

@keyframes design-fill {
	from {
		transform: scaleX(0);
	}

	to {
		transform: scaleX(1);
	}
}

@keyframes design-count {
	from,
	to {
		opacity: 1;
	}
}

@keyframes design-fade-in {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

// Text drifts up through its range: below while fading in, above while fading out.
@keyframes design-text {
	0% {
		opacity: 0;
		transform: translate3d(0, calc(var(--text-fade) * var(--text-drift)), 0);
	}

	50% {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	100% {
		opacity: 0;
		transform: translate3d(0, calc(var(--text-fade) * var(--text-drift) * -1), 0);
	}
}

@keyframes design-text-in {
	from {
		opacity: 0;
		transform: translate3d(0, calc(var(--text-fade) * var(--text-drift)), 0);
	}

	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}

@keyframes design-text-out {
	from {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	to {
		opacity: 0;
		transform: translate3d(0, calc(var(--text-fade) * var(--text-drift) * -1), 0);
	}
}
</style>
