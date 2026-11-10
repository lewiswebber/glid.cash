<template>
  <div class="plus-grid" aria-hidden="true">
    <span class="plus-grid__cell plus-grid__cell--left" />
    <span class="plus-grid__cell plus-grid__cell--center" />
    <span class="plus-grid__cell plus-grid__cell--right" />
    <span class="plus-grid__cell plus-grid__cell--bottom-right" />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
// Four fixed marks: three across the middle, plus bottom right.
.plus-grid {
  --left-edge: 3vw;
  --right-edge: 3vw;
  --bottom-edge: max(24px, 3vw);
  --mark: '+';
  --mark-color: #888;
  --mark-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --mark-size: 2vw;
  --mark-weight: 300;
  @media (max-width: $break-s) {
    --mark-size: 3vh;
  }

  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
  opacity: 1;
  &__cell {
    position: absolute;
    top: 50%;
    display: grid;
    place-items: center;
    transform: translate(-50%, -50%);
    &--left {
      left: var(--left-edge);
    }

    &--center {
      left: 50%;
    }

    &--right {
      left: calc(100% - var(--right-edge));
    }

    &--bottom-right {
      left: calc(100% - var(--right-edge));
      top: calc(100% - var(--bottom-edge));
    }

    &::before {
      content: var(--mark);
      color: var(--mark-color);
      font-family: var(--mark-font);
      font-size: var(--mark-size);
      font-weight: var(--mark-weight);
      line-height: 1;
      letter-spacing: 0;
    }
  }

  // Mobile logo has 20px of layout padding plus 20px of logo padding.
  // Contact is hidden on mobile; retain its header right inset.
  @media (max-width: $break-s) {
    --left-edge: 40px;
  }
}

@media print {
  .plus-grid {
    display: none;
  }
}
</style>
