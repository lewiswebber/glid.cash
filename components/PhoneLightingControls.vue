<script setup lang="ts">
type Position = { x: number; y: number; z: number }
type Light = { color: string; intensity: number; position: Position }
type Lighting = { exposure: number; environmentIntensity: number; key: Light & { angle: number; penumbra: number; targetY: number }; fill: Light }
type Motion = { entrance: { key: Position; fill: Position }; front: { key: Position; fill: Position } }
const lighting = defineModel<Lighting>({ required: true })
const motion = defineModel<Motion>('motion', { required: true })
const open = ref(true)
const phase = ref<'resting' | 'entrance' | 'front'>('resting')
const snapshot = () => ({ lighting: lighting.value, motion: motion.value })
const initial = JSON.stringify(snapshot())
const json = computed(() => JSON.stringify(snapshot(), null, 2))
const status = ref('Copy settings')
const lights = ['key', 'fill'] as const
const controls = computed(() => [
	{ path: 'lighting.exposure', label: 'Exposure', min: 0.1, max: 3, step: 0.01 },
	{ path: 'lighting.environmentIntensity', label: 'Environment', min: 0, max: 2, step: 0.01 },
	{ path: 'lighting.key.intensity', label: 'Key brightness', min: 0, max: 200, step: 1 },
	{ path: 'lighting.key.angle', label: 'Beam angle', min: 5, max: 85, step: 1 },
	{ path: 'lighting.key.penumbra', label: 'Beam softness', min: 0, max: 1, step: 0.01 },
	{ path: 'lighting.key.targetY', label: 'Aim height', min: -2, max: 2, step: 0.05 },
	{ path: 'lighting.fill.intensity', label: 'Fill brightness', min: 0, max: 5, step: 0.01 },
	...lights.flatMap(light => ['x', 'y', 'z'].map(axis => ({
		path: phase.value === 'resting' ? `lighting.${light}.position.${axis}` : `motion.${phase.value}.${light}.${axis}`,
		label: `${light} ${axis.toUpperCase()}`, min: -8, max: 8, step: 0.1,
	}))),
])
function read(path: string): number {
	return path.split('.').reduce((value, key) => value[key], snapshot() as any)
}
function update(path: string, event: Event, min: number, max: number) {
	const input = event.target as HTMLInputElement
	if (!input.value || !Number.isFinite(input.valueAsNumber)) return
	const data = JSON.parse(json.value)
	const keys = path.split('.')
	const last = keys.pop()!
	keys.reduce((value, key) => value[key], data)[last] = Math.min(max, Math.max(min, input.valueAsNumber))
	lighting.value = data.lighting
	motion.value = data.motion
	status.value = 'Copy settings'
}
function reset() {
	const data = JSON.parse(initial)
	lighting.value = data.lighting
	motion.value = data.motion
	status.value = 'Copy settings'
}
async function copy() {
	try { await navigator.clipboard.writeText(json.value); status.value = 'Copied!' }
	catch { status.value = 'Copy JSON below' }
}
</script>

<template>
	<aside class="lighting-controls" data-lenis-prevent aria-label="Phone lighting controls">
		<button class="toggle" type="button" :aria-expanded="open" aria-controls="lighting-panel" @click="open = !open">Phone lighting <span>{{ open ? '−' : '+' }}</span></button>
		<div v-show="open" id="lighting-panel" class="body">
			<label class="phase">Edit light positions
				<select v-model="phase"><option value="resting">Resting hero</option><option value="front">Front / scrolled</option><option value="entrance">Entrance start</option></select>
			</label>
			<p>Positions blend with the animation. Scroll to the top to tune the resting look, or down for the front view.</p>
			<div v-for="control in controls" :key="control.path" class="row">
				<label :for="`lighting-${control.path}`">{{ control.label }}</label>
				<input :id="`lighting-${control.path}`" type="range" :min="control.min" :max="control.max" :step="control.step" :value="read(control.path)" @input="update(control.path, $event, control.min, control.max)">
				<input type="number" :aria-label="`${control.label} value`" :min="control.min" :max="control.max" :step="control.step" :value="read(control.path)" @input="update(control.path, $event, control.min, control.max)">
			</div>
			<label v-for="light in lights" :key="light" class="colour">{{ light }} colour <input v-model="lighting[light].color" type="color"></label>
			<div class="actions"><button type="button" @click="copy">{{ status }}</button><button type="button" @click="reset">Reset</button></div>
			<p>Copy before refreshing. Includes lighting and animation positions.</p>
			<details><summary>Settings JSON</summary><textarea readonly :value="json" aria-label="Lighting settings JSON" @focus="($event.target as HTMLTextAreaElement).select()" /></details>
		</div>
	</aside>
</template>

<style scoped>
.lighting-controls { position: fixed; z-index: 1000; top: 80px; right: 12px; width: min(370px, calc(100vw - 24px)); background: #10171bf5; color: #eee; border: 1px solid #55616b; border-radius: 10px; font: 12px/1.4 system-ui, sans-serif; text-align: left; }
.toggle { display: flex; justify-content: space-between; width: 100%; padding: 12px; }
.body { max-height: calc(100svh - 145px); overflow-y: auto; overscroll-behavior: contain; padding: 0 12px 12px; }
p { color: #b8c7d2; margin: 10px 0; }
.row { display: grid; grid-template-columns: 100px minmax(0, 1fr) 60px; align-items: center; gap: 8px; margin: 8px 0; }
input { min-width: 0; width: 100%; accent-color: #a4d5f3; }
input[type=number], select, textarea { background: #222f39; color: white; border: 1px solid #55616b; border-radius: 4px; padding: 4px; font: inherit; }
.phase, .colour { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
.colour input { width: 40px; }
button { color: inherit; background: transparent; border: 0; font: inherit; cursor: pointer; }
.actions { display: flex; gap: 8px; margin: 12px 0; }
.actions button { border: 1px solid #55616b; border-radius: 4px; padding: 6px 10px; }
summary { cursor: pointer; }
textarea { width: 100%; height: 160px; margin-top: 8px; font-family: monospace; resize: vertical; }
</style>
