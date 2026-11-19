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
	enterEnd: 50,
	// Desktop exit: from when the section's bottom is this % down the viewport (to the top)...
	leaveStart: 50,
	// ...scaling down to this and fading out.
	leaveScale: 0.9,
	// Safari (EXPERIMENTAL): rewind each video while its slide is fully covered, so it plays
	// from the start like Chrome. Off = resumes where it paused. See "Screen recordings" below.
	safariRestart: false
}

const root = ref(null)
const sticky = ref(null)
const videos = ref([])
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
	'--enter-end': `${100 - settings.enterEnd}%`,
	'--leave-start': `${100 - settings.leaveStart}%`,
	'--leave-scale': settings.leaveScale
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

// Slide position from scroll. Drives video playback outside WebKit, and, where CSS
// scroll-driven animations aren't supported, the --s fallback styles too.
const cssTimelines = import.meta.client && CSS.supports('animation-timeline: view()')
let current = ''
let lastValue = ''
let frame = 0

function update() {
	frame = 0
	const section = root.value
	if (!section || !sticky.value) return
	// The sticky's 100svh, not innerHeight, which changes with mobile toolbars.
	const range = section.offsetHeight - sticky.value.offsetHeight
	const rect = section.getBoundingClientRect()
	const progress = range > 0 ? clamp(-rect.top / range, 0, 1) : 0
	const position = positionAt(progress)
	const value = position.toFixed(4)
	// The position clamps at the first/last slide outside the section, so track on-screen separately.
	const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
	// Within a screen of the viewport: early enough to load the first slide's video.
	const near = rect.bottom > -window.innerHeight && rect.top < 2 * window.innerHeight
	// Nothing to do while pinned on a hold or scrolling elsewhere on the page.
	const key = `${value}${onScreen}${near}`
	if (key === current) return
	current = key
	updateVideos(position, onScreen, near)
	if (cssTimelines || value === lastValue) return
	lastValue = value
	section.style.setProperty('--s', value)
	section.style.setProperty('--index', Math.round(position))
}

const schedule = () => {
	if (!frame) frame = requestAnimationFrame(update)
}

/*
Screen recordings.

A slide's visible share is 1 - |position - i|, since each slide covers the last. Play at
60% visible, pause at 40%: adjacent slides' shares add up to 1, so one video always pauses
before the next starts. Everything pauses while the section is off screen.

Chrome etc.: each video loads once the section is within a screen of the viewport and the
previous slide is showing (position > i - 1.5), is held on its first frame by a tiny seek
(browsers otherwise keep the poster until playback), and restarts from 00:00 on each play.

WebKit (desktop Safari, and every iOS browser): the Chrome version made Safari take 10-20s to
start each video, while plain autoplay was smooth. So here every video starts exactly like
plain autoplay (preload auto, loaded at mount), is paused the first time it starts playing
unless its slide is showing (so it holds on its opening frame without a seek), and is then
only ever played or paused: no load(), no preload changes, no seeks. With safariRestart, a
video is rewound only while its slide is fully covered, never just before playing.

Reduced motion: no playback anywhere; the poster stays.
*/
const PLAY_AT = 0.6
const PAUSE_AT = 0.4
// Seeking exactly to 0 can be skipped as a no-op while the poster is up.
const FIRST_FRAME = 0.001
const active = new Set()
let controlled = false
let webkit = false

function isWebKit() {
	const ua = navigator.userAgent
	// iPadOS reports itself as a Mac; touch support gives it away.
	const iOS = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
	const safari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg\/|OPR|Android/.test(ua)
	return iOS || safari
}

function updateVideos(position, onScreen, near) {
	if (!controlled) return
	const visibility = video => onScreen ? 1 - Math.abs(position - Number(video.dataset.index)) : 0
	// Pause first, so the outgoing video stops before the incoming one starts.
	for (const video of active) {
		if (visibility(video) > PAUSE_AT) continue
		active.delete(video)
		video.pause()
	}
	for (const video of videos.value) {
		const index = Number(video.dataset.index)
		if (!webkit && near && position > index - 1.5 && video.preload === 'none') {
			video.preload = 'auto'
			video.load()
		}
		const visible = visibility(video)
		if (visible >= PLAY_AT && !active.has(video)) {
			active.add(video)
			if (!webkit) video.currentTime = 0
			video.play().catch(() => {})
		} else if (visible <= 0 && !active.has(video) && video.currentTime > FIRST_FRAME && (!webkit || settings.safariRestart)) {
			// Fully covered: rewind so it's back on its first frame next time it's revealed.
			video.currentTime = FIRST_FRAME
		}
	}
}

// Chrome etc.: once loaded, hold a video on its first frame (unless it's already playing).
const showFirstFrame = event => {
	const video = event.target
	if (!active.has(video)) video.currentTime = FIRST_FRAME
}

// WebKit: the first time an autoplaying video starts, pause it unless its slide is showing.
const holdOpeningFrame = event => {
	const video = event.target
	if (!active.has(video)) video.pause()
}

function setUpVideos() {
	if (!videos.value.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
	controlled = true
	webkit = isWebKit()
	videos.value.forEach(video => {
		if (!webkit) {
			video.addEventListener('loadeddata', showFirstFrame)
			return
		}
		video.addEventListener('playing', holdOpeningFrame, { once: true })
		video.preload = 'auto'
		video.autoplay = true
		video.load()
	})
}

onMounted(() => {
	setUpVideos()
	// Nothing to track when CSS runs the slideshow and there are no videos to control.
	if (cssTimelines && !controlled) return
	window.addEventListener('scroll', schedule, { passive: true })
	window.addEventListener('resize', schedule)
	update()
})

onBeforeUnmount(() => {
	videos.value.forEach(video => {
		video.removeEventListener('loadeddata', showFirstFrame)
		video.removeEventListener('playing', holdOpeningFrame)
	})
	cancelAnimationFrame(frame)
	window.removeEventListener('scroll', schedule)
	window.removeEventListener('resize', schedule)
})
</script>

<template>
	<section ref="root" class="design" aria-labelledby="design-title" :style="style">
		<div ref="sticky" class="design__sticky">
			<div class="design__media">
				<div v-for="(slide, index) in contents.slides" :key="slide.screen" class="design__slide" :style="slideStyle(index)">
					<div class="design__layer" :style="{ '--from': slide.gradient[0], '--via': slide.gradient[1] }">
						<video v-if="slide.video" ref="videos" class="design__phone" :src="`/img/design/${slide.screen}.mp4`" :poster="`/img/design/${slide.screen}.jpg`" width="1260" height="2736" :data-index="index" :aria-label="slide.alt" muted loop playsinline preload="none" />
						<picture v-else class="design__phone">
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
							<small v-if="slide.note" class="design__note">{{ slide.note }}</small>
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

		// A video is the frame itself; an image fills its <picture> frame.
		&:is(video) {
			display: block;
			object-fit: cover;
		}

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

	// Short aside under a slide's copy; a <small>, so the mobile p + p rule leaves it showing.
	&__note {
		display: block;
		margin-top: 1.2em;
		font-size: inherit;
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

		/*
		Desktop entrance and exit. Entrance: from "section top at viewport bottom" to "top at
		--enter-end". Exit, the reverse: from "section bottom at --leave-start" to "bottom at
		viewport top", scaling down and fading out. The exit doesn't fill backwards, so the
		entrance's end state holds until the exit begins.
		*/
		@media (min-width: ($break-s + 1px)) and (prefers-reduced-motion: no-preference) {
			&__sticky {
				transform-origin: 50% 0;
				animation:
					design-enter linear both,
					design-leave linear forwards;
				animation-timeline: --design, --design;
				animation-range:
					entry 0% entry var(--enter-end),
					exit var(--leave-start) exit 100%;
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

@keyframes design-leave {
	from {
		transform-origin: 50% 100%;
		transform: none;
		opacity: 1;
	}

	to {
		transform-origin: 50% 100%;
		transform: scale(var(--leave-scale));
		opacity: 0;
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
