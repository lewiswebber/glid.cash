<template>
  <footer class="site-footer monospace">
    <span>Glid © {{ new Date().getFullYear() }}</span>
    <a href="mailto:lewis@stud.house" class="hover_effect"><span>Contact</span></a>
  </footer>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2vw 3vw;
  border-top: 1px solid rgb(255 255 255 / 20%);
  color: var(--grey);
}

@media (max-width: $break-s) {
  .site-footer {
    padding: 24px 20px;
  }
}
</style>
