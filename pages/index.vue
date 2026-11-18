<script setup>
import { design } from '~/assets/content/home'

const homepage = ref(null)
const { $initHomeAnimations } = useNuxtApp()
let cleanup

onMounted(() => {
	cleanup = $initHomeAnimations?.(homepage.value)
})

onBeforeUnmount(() => {
	cleanup?.()
})
</script>

<template>
	<div ref="homepage">
		<SiteHeader />
		<main id="top">
			<HomeBanner3D />
			<HomeIntro />
			<Design :contents="design" id="design" />
			<HomeContact />
		</main>
		<SiteFooter />
	</div>
</template>
