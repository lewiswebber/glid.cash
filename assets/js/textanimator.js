import gsap from 'gsap'

const symbols = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*_-+=:<>,'

// Keep all scramble callbacks on one cancellable timeline. Never tween text:
// GSAP can interpret symbols in innerHTML as relative numeric values.
export class TextAnimator {
  constructor(element) {
    this.label = element.querySelector('span')
    this.originalHTML = this.label.innerHTML
    this.originalText = this.label.textContent
    this.originalLabel = this.label.getAttribute('aria-label')
    this.label.setAttribute('aria-label', this.originalText)
    this.chars = Array.from(this.originalText, letter => {
      const char = document.createElement('span')
      char.className = 'char'
      char.textContent = letter
      char.setAttribute('aria-hidden', 'true')
      return char
    })
    this.label.replaceChildren(...this.chars)
    this.originalChars = Array.from(this.originalText)
  }

  animate() {
    this.reset()
    this.timeline = gsap.timeline({ onComplete: () => this.restore() })
    this.chars.forEach((char, index) => {
      if (/\s/.test(this.originalChars[index])) return
      const scramble = () => { char.textContent = symbols[Math.floor(Math.random() * symbols.length)] }
      this.timeline.call(scramble, [], index * 0.02)
      this.timeline.call(scramble, [], index * 0.02 + 0.02)
      this.timeline.call(() => { char.textContent = this.originalChars[index] }, [], index * 0.02 + 0.12)
    })
  }

  restore() {
    this.chars.forEach((char, index) => {
      char.textContent = this.originalChars[index]
      char.style.opacity = '1'
    })
  }

  reset() {
    this.timeline?.kill()
    this.timeline = null
    this.restore()
  }

  animateBack() { this.reset() }

  destroy() {
    this.reset()
    this.label.innerHTML = this.originalHTML
    if (this.originalLabel === null) this.label.removeAttribute('aria-label')
    else this.label.setAttribute('aria-label', this.originalLabel)
  }
}
