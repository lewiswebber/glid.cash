<script setup lang="ts">
import type { Object3D, Mesh, Material, Texture, MeshStandardMaterial } from 'three'

// Phone pose, camera, and lighting settings.
const phoneSettings = reactive({
	thickness: 0.8, // Depth multiplier: 20% thinner, with width and height preserved.
	// Degrees: X = tilt forward/back, Y = turn left/right, Z = lean sideways.
	rotation: { x: -28, y: 52, z: -18 },
	scroll: {
		distance: 0.7, // Reach front-centre at 70% of the banner height.
		rotation: { x: 0, y: 0, z: 0 },
		// Seconds the pose takes to catch up with the scroll (time constant; 0 = follow exactly).
		// Absorbs the uneven scroll updates iOS Safari sends while its toolbar resizes.
		smoothing: 0.12,
	},
	entrance: { duration: 1400, rotationOffset: { x: -10, y: 18, z: 4 } },
	// Final size multiplier (1 = original size), applied AFTER automatic fitting.
	scale: 0.9,
	// Offset as a percentage of the canvas: positive X = right, positive Y = down.
	position: { x: 0, y: 5 },
	camera: {
		fieldOfView: 28, // Degrees; wider values give stronger perspective.
		distance: 10, // Model is normalized to 2.5 units tall; keep camera outside it.
		autoFit: true, // Fits and centers the rotated phone before scale/position.
		frameFill: 1, // Fraction of the canvas occupied when autoFit is enabled.
	},
	lighting: {
		exposure: 1.22,
		environmentIntensity: 0.47,
		key: { color: '#AFBCC5', intensity: 83, position: { x: -4.1, y: 2.5, z: 0.2 }, targetY: 0.35, angle: 15, penumbra: 0.59 },
		fill: { color: '#b8d7ec', intensity: 1.82, position: { x: 3.3, y: -1.8, z: -2.8 } },
	},
})

// Light-source positions only; exposure, intensity, colour, and beam stay fixed.
// The saved phoneSettings.lighting positions remain the resting hero look.
const lightingMotion = reactive({
	entrance: {
		key: { x: -4, y: 5, z: 1.5 },
		fill: { x: 4.5, y: 0.5, z: 0.5 },
	},
	front: {
		key: { x: -1.5, y: 3, z: 4.5 },
		fill: { x: 2.5, y: 0.5, z: 3.5 },
	},
})

const showLightingControls = false

const hero = ref<HTMLElement>()
const phoneHost = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const ready = ref(false)
let disposed = false
let cleanup = () => {}
let entranceFrame = 0
let finishEntrance = () => {}
let removeScrollListeners = () => {}
let stopLightingWatch = () => {}

onBeforeUnmount(() => {
	disposed = true
	cancelAnimationFrame(entranceFrame)
	removeScrollListeners()
	stopLightingWatch()
	cleanup()
})

onMounted(async () => {
	try {
		// Keep Three.js out of SSR and load it separately from the initial page bundle.
		const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
			import('three'),
			import('three/addons/loaders/GLTFLoader.js'),
			import('three/addons/environments/RoomEnvironment.js'),
		])
		if (disposed || !canvas.value || !phoneHost.value) return

		const releaseModel = (root: Object3D) => {
			const materials = new Set<Material>()
			const textures = new Set<Texture>()
			root.traverse((object) => {
				const mesh = object as Mesh
				if (!mesh.isMesh) return
				mesh.geometry.dispose()
				for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
					materials.add(material)
					for (const value of Object.values(material)) {
						if (value?.isTexture) textures.add(value)
					}
				}
			})
			textures.forEach((texture) => {
				texture.dispose()
				texture.source.data?.close?.()
			})
			materials.forEach((material) => material.dispose())
		}

		const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
		cleanup = () => renderer.dispose()
		renderer.setClearColor(0x000000, 0)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = phoneSettings.lighting.exposure

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(phoneSettings.camera.fieldOfView, 510 / 904, 0.1, 100)
		camera.position.z = phoneSettings.camera.distance

		// Low studio reflections leave the sides dark; the overhead spotlight adds falloff.
		const pmrem = new THREE.PMREMGenerator(renderer)
		const room = new RoomEnvironment()
		const environment = pmrem.fromScene(room, 0.04)
		room.dispose()
		pmrem.dispose()
		scene.environment = environment.texture
		scene.environmentIntensity = phoneSettings.lighting.environmentIntensity
		const { key: keySettings, fill: fillSettings } = phoneSettings.lighting
		const key = new THREE.SpotLight(keySettings.color, keySettings.intensity, 0, THREE.MathUtils.degToRad(keySettings.angle), keySettings.penumbra, 2)
		key.position.set(keySettings.position.x, keySettings.position.y, keySettings.position.z)
		const fill = new THREE.DirectionalLight(fillSettings.color, fillSettings.intensity)
		fill.position.set(fillSettings.position.x, fillSettings.position.y, fillSettings.position.z)
		key.target.position.set(0, keySettings.targetY, 0)
		scene.add(key, key.target, fill)

		let model: Object3D | undefined
		let updatePose = (_dt?: number) => {}
		let restingZoom = 1
		let frontWidth = 1.25
		let frameCenterX = 0
		let frameCenterY = 0
		let scrollProgress = 0
		let bufferWidth = 0
		let bufferHeight = 0
		let layoutDirty = true
		let requestRender = () => {}
		const render = () => {
			if (disposed || !phoneHost.value) return
			const frame = phoneHost.value.getBoundingClientRect()
			if (!frame.width || !frame.height) return
			// Measure the frame against the canvas, not the viewport. Both are fixed, so any
			// shift iOS Safari reports for fixed boxes while its toolbar animates cancels out.
			const canvasRect = canvas.value!.getBoundingClientRect()
			const frameLeft = frame.left - canvasRect.left
			const frameTop = frame.top - canvasRect.top
			// CSS uses lvh for the drawing area and svh for composition. Neither follows
			// Safari's toolbar animation, unlike innerHeight / visualViewport.height.
			const width = canvas.value!.clientWidth
			const height = canvas.value!.clientHeight
			const compositionHeight = hero.value!.clientHeight
			if (!width || !height) return
			// Keep the upright phone fully inside the viewport, including on mobile.
			const visibleHeight = 2 * (phoneSettings.camera.distance - 0.2)
				* Math.tan(THREE.MathUtils.degToRad(phoneSettings.camera.fieldOfView / 2))
			const frontZoom = Math.min(
				0.86 * compositionHeight / frame.height * visibleHeight / 2.5,
				0.86 * width / frame.width * visibleHeight * (frame.width / frame.height) / frontWidth,
			) * phoneSettings.scale
			camera.zoom = THREE.MathUtils.lerp(restingZoom, frontZoom, scrollProgress)
			// Render across the viewport, while retaining the original image's framing.
			// A rotating mesh can now extend beyond that frame without hitting a canvas edge.
			// Assigning canvas width/height resets its drawing buffer, even at the same size.
			if (width !== bufferWidth || height !== bufferHeight) {
				renderer.setSize(width, height, false)
				bufferWidth = width
				bufferHeight = height
			}
			const centerX = THREE.MathUtils.lerp(frameLeft + frame.width / 2, width / 2, scrollProgress)
			const centerY = THREE.MathUtils.lerp(frameTop + frame.height / 2, compositionHeight / 2, scrollProgress)
			camera.setViewOffset(frame.width, frame.height,
				frameCenterX * (1 - scrollProgress) * camera.zoom * frame.width / 2
					- phoneSettings.position.x * (1 - scrollProgress) * frame.width / 100 - (centerX - frame.width / 2),
				-frameCenterY * (1 - scrollProgress) * camera.zoom * frame.height / 2
					- phoneSettings.position.y * (1 - scrollProgress) * frame.height / 100 - (centerY - frame.height / 2),
				width, height)
			renderer.render(scene, camera)
		}
		// Observe stable layout boxes instead of Safari's noisy window resize events.
		// Real width/height/orientation changes still invalidate the layout.
		const observer = new ResizeObserver(() => {
			layoutDirty = true
			requestRender()
		})
		observer.observe(phoneHost.value)
		observer.observe(canvas.value)
		if (hero.value) observer.observe(hero.value)
		const lost = (event: Event) => {
			event.preventDefault()
			cancelAnimationFrame(entranceFrame)
			entranceFrame = 0
			finishEntrance()
			ready.value = false
		}
		const restored = () => { updatePose(); render(); ready.value = !!model }
		const element = canvas.value
		element.addEventListener('webglcontextlost', lost)
		element.addEventListener('webglcontextrestored', restored)
		cleanup = () => {
			observer.disconnect()
			element.removeEventListener('webglcontextlost', lost)
			element.removeEventListener('webglcontextrestored', restored)
			if (model) releaseModel(model)
			environment.dispose()
			renderer.dispose()
		}

		const gltf = await new GLTFLoader().loadAsync('/img/iphone_15/scene.gltf')
		if (disposed) { releaseModel(gltf.scene); return }
		model = gltf.scene
		// This asset faces -Z; align its display to +Z for the existing animation poses.
		model.rotation.y = Math.PI
		model.scale.z *= phoneSettings.thickness
		// Replace the display artwork, preserving the model's screen UVs and glass.
		const screen = model.getObjectByName('Object_81') as Mesh | undefined
		// Remove the front sensor/island assembly, keeping the earpiece and bezel.
		for (const name of ['Object_76', 'Object_78', 'Object_85', 'Object_90', 'Object_92', 'Object_94', 'Object_96', 'Object_98', 'Object_101']) {
			const part = model.getObjectByName(name)
			if (part) part.visible = false
		}
		if (screen?.geometry.index) {
			// Fill the island's actual mesh hole. Reuse boundary vertices so UVs,
			// normals, and the rounded outer screen remain exactly as authored.
			const geometry = screen.geometry
			const positions = geometry.attributes.position
			const indices = Array.from(geometry.index!.array)
			const edges = new Map<string, { a: number; b: number; count: number }>()
			for (let i = 0; i < indices.length; i += 3) {
				for (const [a, b] of [[indices[i], indices[i + 1]], [indices[i + 1], indices[i + 2]], [indices[i + 2], indices[i]]]) {
					const key = `${Math.min(a, b)}:${Math.max(a, b)}`
					const edge = edges.get(key)
					if (edge) edge.count++
					else edges.set(key, { a, b, count: 1 })
				}
			}
			const neighbours = new Map<number, number[]>()
			const isIsland = (i: number) => Math.abs(positions.getX(i)) < 1.2
				&& positions.getY(i) > 6.5 && positions.getY(i) < 7.6
			for (const { a, b, count } of edges.values()) {
				if (count !== 1 || !isIsland(a) || !isIsland(b)) continue
				neighbours.set(a, [...(neighbours.get(a) ?? []), b])
				neighbours.set(b, [...(neighbours.get(b) ?? []), a])
			}
			const first = neighbours.keys().next().value
			if (first !== undefined) {
				const boundary = [first]
				let previous = -1
				let current = first
				while (boundary.length <= neighbours.size) {
					const next = neighbours.get(current)?.find(index => index !== previous)
					if (next === undefined || next === first) break
					boundary.push(next)
					previous = current
					current = next
				}
				const contour = boundary.map(index => new THREE.Vector2(positions.getX(index), positions.getY(index)))
				for (const face of THREE.ShapeUtils.triangulateShape(contour, [])) {
					const [a, b, c] = face.map(index => boundary[index])
					// The unrotated screen faces -Z: use clockwise winding.
					const cross = (positions.getX(b) - positions.getX(a)) * (positions.getY(c) - positions.getY(a))
						- (positions.getY(b) - positions.getY(a)) * (positions.getX(c) - positions.getX(a))
					indices.push(...(cross > 0 ? [a, c, b] : [a, b, c]))
				}
				geometry.setIndex(indices)
			}
		}
		const screenMaterial = screen && (Array.isArray(screen.material)
			? screen.material.find(material => material.name === 'pIJKfZsazmcpEiU')
			: screen.material) as MeshStandardMaterial | undefined
		if (screenMaterial?.isMeshStandardMaterial) {
			const screenTexture = await new THREE.TextureLoader().loadAsync('/img/screen_s.jpg')
			if (disposed) { screenTexture.dispose(); return }
			// glTF UVs use a top-left origin, unlike TextureLoader's default orientation.
			screenTexture.flipY = false
			// Preserve the corrected vertical orientation without mirroring horizontally.
			screenTexture.center.set(0.5, 0.5)
			screenTexture.repeat.set(1, -1)
			screenTexture.colorSpace = THREE.SRGBColorSpace
			screenTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
			const originalScreen = screenMaterial.emissiveMap
			screenMaterial.emissiveMap = screenTexture
			screenMaterial.emissive.set(0xffffff)
			screenMaterial.emissiveIntensity = 1 // Match the previous screen brightness.
			screenMaterial.needsUpdate = true
			originalScreen?.dispose()
			originalScreen?.source.data?.close?.()
		}
		const bounds = new THREE.Box3().setFromObject(model)
		const size = bounds.getSize(new THREE.Vector3())
		const center = bounds.getCenter(new THREE.Vector3())
		const scale = 2.5 / size.y
		frontWidth = size.x * scale
		model.scale.multiplyScalar(scale)
		model.position.copy(center).multiplyScalar(-scale)

		// The imported scene is upright and now aligned with the display facing +Z.
		// Screen node: Object_81; material: pIJKfZsazmcpEiU.
		// Custom artwork is applied to the screen emissive map above.
		const pose = new THREE.Group()
		pose.add(model)
		scene.add(pose)

		const applySettings = () => {
			// Reset projection before measuring; otherwise repeated edits compound zoom/offset.
			camera.clearViewOffset()
			camera.zoom = 1
			camera.aspect = 510 / 904
			camera.fov = phoneSettings.camera.fieldOfView
			camera.position.z = phoneSettings.camera.distance
			camera.updateProjectionMatrix()
			pose.rotation.set(
				THREE.MathUtils.degToRad(phoneSettings.rotation.x),
				THREE.MathUtils.degToRad(phoneSettings.rotation.y),
				THREE.MathUtils.degToRad(phoneSettings.rotation.z),
				'YXZ',
			)
			// Compute fitting before applying user scale and offsets so they are never cancelled.
			scene.updateMatrixWorld(true)
			camera.updateMatrixWorld(true)
			const projected = new THREE.Box2()
			pose.traverse((object) => {
				const mesh = object as Mesh
				if (!mesh.isMesh) return
				const positions = mesh.geometry.attributes.position
				const point = new THREE.Vector3()
				for (let i = 0; i < positions.count; i++) {
					point.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld).project(camera)
					projected.expandByPoint(new THREE.Vector2(point.x, point.y))
				}
			})
			const autoFit = phoneSettings.camera.autoFit
			const fitZoom = autoFit
				? (2 * phoneSettings.camera.frameFill) / Math.max(projected.max.x - projected.min.x, projected.max.y - projected.min.y)
				: 1
			restingZoom = fitZoom * phoneSettings.scale
			camera.zoom = restingZoom
			frameCenterX = autoFit ? (projected.min.x + projected.max.x) / 2 : 0
			frameCenterY = autoFit ? (projected.min.y + projected.max.y) / 2 : 0
			render()
		}
		applySettings()
		// Fit once at the final pose so the camera stays still throughout the turn.
		const finalRotation = pose.quaternion.clone()
		const offset = phoneSettings.entrance.rotationOffset
		const startRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
			THREE.MathUtils.degToRad(phoneSettings.rotation.x + offset.x),
			THREE.MathUtils.degToRad(phoneSettings.rotation.y + offset.y),
			THREE.MathUtils.degToRad(phoneSettings.rotation.z + offset.z),
			'YXZ',
		))
		const frontRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
			THREE.MathUtils.degToRad(phoneSettings.scroll.rotation.x),
			THREE.MathUtils.degToRad(phoneSettings.scroll.rotation.y),
			THREE.MathUtils.degToRad(phoneSettings.scroll.rotation.z),
			'YXZ',
		))
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		let entranceProgress = reducedMotion ? 1 : 0
		let scrollTarget = 0
		// dt in ms since the last frame; without it (initial pose, context restore) jump straight there.
		updatePose = (dt?: number) => {
			const rect = hero.value?.getBoundingClientRect()
			scrollTarget = !reducedMotion && rect
				? THREE.MathUtils.clamp(-rect.top / (rect.height * phoneSettings.scroll.distance), 0, 1)
				: 0
			const smoothing = phoneSettings.scroll.smoothing * 1000
			scrollProgress = dt !== undefined && smoothing > 0
				? scrollTarget + (scrollProgress - scrollTarget) * Math.exp(-dt / smoothing)
				: scrollTarget
			if (Math.abs(scrollTarget - scrollProgress) < 0.0005) scrollProgress = scrollTarget
			renderer.toneMappingExposure = phoneSettings.lighting.exposure
			scene.environmentIntensity = phoneSettings.lighting.environmentIntensity
			for (const [light, settings] of [[key, phoneSettings.lighting.key], [fill, phoneSettings.lighting.fill]] as const) {
				light.color.set(settings.color)
				light.intensity = settings.intensity
			}
			key.angle = THREE.MathUtils.degToRad(phoneSettings.lighting.key.angle)
			key.penumbra = phoneSettings.lighting.key.penumbra
			key.target.position.y = phoneSettings.lighting.key.targetY
			const easedEntrance = 1 - Math.pow(1 - entranceProgress, 3)
			pose.quaternion.slerpQuaternions(startRotation, finalRotation, easedEntrance)
			// Blend from the entrance pose, so scrolling during loading/entrance never snaps.
			pose.quaternion.slerp(frontRotation, scrollProgress)
			// Use the same progress as the phone so both motions arrive together at 70%.
			// Blend from the current entrance path if the user scrolls before it finishes.
			for (const [light, name] of [[key, 'key'], [fill, 'fill']] as const) {
				const from = lightingMotion.entrance[name]
				const resting = phoneSettings.lighting[name].position
				const front = lightingMotion.front[name]
				light.position.set(
					THREE.MathUtils.lerp(THREE.MathUtils.lerp(from.x, resting.x, easedEntrance), front.x, scrollProgress),
					THREE.MathUtils.lerp(THREE.MathUtils.lerp(from.y, resting.y, easedEntrance), front.y, scrollProgress),
					THREE.MathUtils.lerp(THREE.MathUtils.lerp(from.z, resting.z, easedEntrance), front.z, scrollProgress),
				)
			}
		}
		finishEntrance = () => { entranceProgress = 1; updatePose() }
		let startedAt: number | undefined
		let lastTime: number | undefined
		const animate = (time: number) => {
			if (disposed) return
			startedAt ??= time
			// Assume one frame when (re)starting, and cap long gaps (background tabs).
			const dt = lastTime === undefined ? 1000 / 60 : Math.min(time - lastTime, 100)
			lastTime = time
			const previousEntrance = entranceProgress
			const previousScroll = scrollProgress
			if (!reducedMotion) entranceProgress = Math.min((time - startedAt) / phoneSettings.entrance.duration, 1)
			updatePose(dt)
			if (layoutDirty || entranceProgress !== previousEntrance || scrollProgress !== previousScroll) {
				render()
				layoutDirty = false
			}
			// Keep running while the entrance plays or the pose is still catching up with the scroll.
			const settling = entranceProgress < 1 || scrollProgress !== scrollTarget
			entranceFrame = settling ? requestAnimationFrame(animate) : 0
			if (!settling) lastTime = undefined
		}
		const scheduleRender = () => {
			if (!entranceFrame && ready.value) entranceFrame = requestAnimationFrame(animate)
		}
		stopLightingWatch = watch([() => phoneSettings.lighting, lightingMotion], () => {
			layoutDirty = true
			scheduleRender()
		}, { deep: true })
		requestRender = scheduleRender
		window.addEventListener('scroll', scheduleRender, { passive: true })
		removeScrollListeners = () => {
			window.removeEventListener('scroll', scheduleRender)
		}
		updatePose()
		render()
		if (!reducedMotion) entranceFrame = requestAnimationFrame(animate)
		ready.value = true
	} catch (error) {
		cleanup()
		cleanup = () => {}
		ready.value = false
		if (!disposed) console.warn('Unable to display the 3D iPhone.', error)
	}
})
</script>

<template>
	<section ref="hero" class="hero">
		<canvas ref="canvas" class="hero__canvas" :class="{ 'is-ready': ready }" aria-hidden="true" />
		<div class="hero__content">
			<div ref="phoneHost" class="hero__phone" role="img" aria-label="3D iPhone 15" :aria-hidden="!ready">
			</div>

			<div class="hero__tagline">
				<!-- The badge follows the h1 so it stays out of the heading; CSS places it above. -->
				<div class="hero__headline" effect__fadeOut2>
					<h1 class="text-title">Bitcoin wallet that feels like <em>yours.</em></h1>
					<p class="hero__badge monospace opacity__50">Coming soon</p>
				</div>
			</div>
		</div>
		<!-- Dev-only tuning panel; Lazy keeps it out of the page bundle. -->
		<LazyPhoneLightingControls v-if="showLightingControls" v-model="phoneSettings.lighting" :motion="lightingMotion" @update:motion="Object.assign(lightingMotion, $event)" />
	</section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

/* Desktop sizes in vw/svh; the gradient scrolls with the page. */
.hero {
	position: relative;
	height: 100vh;
	height: 100svh;
	overflow: hidden;
	background: linear-gradient(180deg, #7c7c7c 0%, #2b4e64 50%, #000 100%);

	&__content {
		position: absolute;
		inset: 0;
	}

	@media (max-width: $break-s) {
		background: linear-gradient(170deg, #7c7c7c 0%, #2b4e64 50%, #000 110%);
	}

	&__phone {
		position: fixed;
		top: -9svh;
		left: 50%;
		// Fixed, so the WebGL framing never moves with scroll. 510 × 904 is the original phone image.
		width: min(54svh, 40vw);
		aspect-ratio: 510 / 904;
		transform: translateX(-50%);
		pointer-events: none;
	}

	&__canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		// Cover the expanded viewport without resizing as Safari's toolbar moves.
		height: 100vh;
		height: 100lvh;
		pointer-events: none;
		opacity: 0;
		transition: opacity 250ms ease-out;

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}

		&.is-ready {
			opacity: 1;
		}
	}

	/* Centred headline (Figma 1665 frame: 74px, vertically centred). */
	&__tagline {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6vw;
		color: #fff;
		text-align: center;
		pointer-events: none;
	}

	&__headline {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__badge {
		order: -1;
		margin-bottom: 1.2vw;
		padding: .5em 1.4em;
		border: 1px solid currentColor;
		border-radius: 999px;
		white-space: nowrap;
	}

	// Desktop: above the gap between "like" and "yours", anchored to the <em>.
	// Without anchor positioning it stays centred above the headline.
	@supports (anchor-name: --a) {
		@media (min-width: ($break-s + 1px)) {
			em {
				anchor-name: --hero-yours;
			}

			&__badge {
				position: absolute;
				position-anchor: --hero-yours;
				bottom: anchor(top);
				left: anchor(left);
				margin-bottom: .6vw;
				translate: -50% 0;
			}
		}
	}

	/*
	Mobile: Figma frame 402 × 874, in px.
	The phone frame starts above the screen; the text stays anchored to the bottom.
	*/
	@media (max-width: $break-s) {
		&__phone {
			top: -35svh;
			left: 50%;
			width: 390px;
			margin-left: -220px;
			transform: none;
		}

		/* Mobile keeps the bottom-centred tagline above the nav. */
		&__badge {
			margin-bottom: 16px;
		}

		&__tagline {
			align-items: flex-end;
			padding: 0 0 calc(150px + env(safe-area-inset-bottom));

			h1 {
				width: 340px;
			}
		}
	}
}
</style>
