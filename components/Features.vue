<script setup>
const props = defineProps({
  contents: {
    type: Object,
    required: true
  }
})

// Desktop cards stack; mobile cards flow naturally to fit text and images.
const stack = {
  desktop: {
    unit: 'vw',
    step: 5,
    itemHeight: 48,
    scrollHeight: 53,
    imageHeight: 45
  },
  mobile: {
    unit: 'svh',
    step: 10,
    itemHeight: 40,
    scrollHeight: 50
  }
}
const itemsStyle = computed(() => {
  const count = props.contents.contents.length
  const {
    desktop,
    mobile
  } = stack
  return {
    '--stack-height-desktop': `${count * desktop.scrollHeight}${desktop.unit}`,
    '--stack-height-mobile': `${count * mobile.scrollHeight}${mobile.unit}`,
    '--stack-image-height': `${desktop.imageHeight}${desktop.unit}`,
    '--stack-bottom-desktop': `${count * desktop.step + desktop.itemHeight}${desktop.unit}`,
    '--stack-bottom-mobile': `${count * mobile.step + mobile.itemHeight}${mobile.unit}`
  }
})
const getItemStyle = index => ({
  '--stack-top-desktop': `${(index + 1) * stack.desktop.step}${stack.desktop.unit}`,
  '--stack-top-mobile': `${(index + 1) * stack.mobile.step}${stack.mobile.unit}`
})
</script>

<template>
  <section class="section features-section">
    <div class="features">
      <!-- <div class="features__title layout">
        <div class="layout__third monospace opacity__50">
          <span class="block" data-splitting effect__titleRandom>{{ contents.subtitle }}</span>
        </div>
        <div class="layout__second">
          <h2 data-splitting effect__titleRandom><template v-for="(line, index) in contents.title.split('\n')" :key="index"><br v-if="index > 0">{{ line }}</template></h2>
        </div>
      </div> -->
      <div class="features__items" :style="itemsStyle">
        <article v-for="(content, index) in contents.contents" :id="`feature-${index + 1}`" :key="content.title" class="features__item" :style="getItemStyle(index)">
          <div class="layout">
            <div class="layout__third monospace opacity__50">00{{ index + 1 }}</div>
            <div class="layout__second">
              <div class="features__text">
                <h3 class="text-lead">{{ content.title }}</h3>
                <div class="features__description monospace opacity__50">
                  <p v-for="paragraph in content.paragraphs" :key="paragraph">{{ paragraph }}</p>
                </div>
              </div>
              <div class="features__image">
                <img :src="content.image" :alt="content.alt ?? content.title" loading="lazy" fetchpriority="low" decoding="async">
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
    <div class="features__bottom-overlay" aria-hidden="true" />
  </section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.features-section {
  @media (max-width: $break-s) {
    // Clip the fixed gradient to this section as it enters and leaves the viewport.
    clip-path: inset(0);
  }
}

.features {
  &__bottom-overlay {
    display: none;

    @media (max-width: $break-s) {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 20svh;
      opacity: 0;
      z-index: 10;
      background: linear-gradient(0deg, var(--bgcolor) 3%, transparent 100%);
      pointer-events: none;
    }
  }

  position: relative;
  padding-bottom: 1vw;
  &__title h2 {
    padding-bottom: 5vw;
    width: 100%;
    @media (max-width: $break-s) {
      margin-bottom: 20vw;
    }
  }

  &__items {
    --stack-bottom: var(--stack-bottom-desktop);
    min-height: var(--stack-height-desktop);
    @media (max-width: $break-s) {
      min-height: 0;
      padding-top: 10svh;
    }
  }

  &__item {
    background: var(--bgcolor);
    border-top: 1px solid rgb(255 255 255 / 20%);
    position: sticky;
    top: var(--stack-top-desktop);
    height: calc(var(--stack-bottom) - var(--stack-top-desktop));
    @media (max-width: $break-s) {
      position: relative;
      top: auto;
      height: auto;
      padding-bottom: 60px;
    }

    .layout {
      position: relative;
    }

    .layout__third {
      @media (max-width: $break-s) {
        position: absolute;
        right: 20px;
        width: auto;
      }
    }

    .layout__second {
      display: flex;
      justify-content: space-between;

      @media (max-width: $break-s) {
        flex-direction: column;
      }
    }
  }

  &__image {
    width: 52.5%;
    flex-shrink: 0;
    height: var(--stack-image-height);
    aspect-ratio: 7 / 9;
    border-radius: var(--radius);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: $break-s) {
      width: 100%;
      // Mobile layout has 20px gutters on each side.
      height: calc((100vw - 40px) * 8 / 7 - 30px);
      aspect-ratio: auto;

      img {
        display: block;
        object-position: center top;
      }
    }
  }

  &__text {
    padding-bottom: 8vw;
    width: 42.5%;
    @media (max-width: $break-s) {
      width: 100%;
      padding-bottom: 24px;
    }

    h3 {
      margin-bottom: 8vw;
      @media (max-width: $break-s) {
        margin-bottom: 32px;
        padding-right: 40px;
      }
    }
  }

  &__description {
    width: 70%;
    p + p {
      margin-top: 1.2em;
    }

    @media (max-width: $break-s) {
      margin-top: 0;
    }
  }
}
</style>
