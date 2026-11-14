<template>
  <footer class="site-footer layout monospace">
    <div class="layout__third" aria-hidden="true" />
    <div class="site-footer__content layout__second">
      <span>Glid © {{ new Date().getFullYear() }}</span>
      <a href="mailto:wbbr.co@gmail.com" class="hover_effect"><span>Contact</span></a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.site-footer {
  position: relative;
  background-color: var(--bgcolor);
  padding-top: 0;
  padding-bottom: 0;
  color: var(--grey);

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2vw 0;
    border-top: 1px solid rgb(255 255 255 / 20%);
  }

  @media (max-width: $break-s) {
    padding: 24px 20px;
    border-top: 1px solid rgb(255 255 255 / 20%);

    .layout__third {
      display: none;
    }

    &__content {
      padding: 0;
      border-top: 0;
    }
  }
}
</style>
