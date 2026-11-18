import test from 'node:test'
import assert from 'node:assert/strict'
import { TextAnimator } from '../assets/js/textanimator.js'

function animatorFor(text) {
	const animator = Object.create(TextAnimator.prototype)
	animator.originalChars = Array.from(text)
	animator.chars = Array.from(text, textContent => ({ textContent, style: {} }))
	return animator
}
const textOf = animator => animator.chars.map(char => char.textContent).join('')

test('scramble restores the exact label after completion, including punctuation', () => {
	const animator = animatorFor('Contact, + Get in touch')
	animator.animate()
	animator.timeline.totalProgress(1)
	assert.equal(textOf(animator), 'Contact, + Get in touch')
	animator.reset()
})

test('leaving during a scramble cancels pending mutations and restores text', () => {
	const animator = animatorFor('Contact')
	for (let i = 0; i < 20; i++) {
		animator.animate()
		animator.timeline.time(0.04)
		animator.reset()
		assert.equal(textOf(animator), 'Contact')
		assert.equal(animator.timeline, null)
		assert.ok(animator.chars.every(char => char.style.opacity === '1'))
	}
	animator.animate()
	animator.timeline.totalProgress(1)
	assert.equal(textOf(animator), 'Contact')
	animator.reset()
})
