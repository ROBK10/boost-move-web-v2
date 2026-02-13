<template>
  <nav class="nav">
    <RouterLink class="link" to="/movin">Movin</RouterLink>
    <RouterLink class="link" to="/min-helse">Min Helse</RouterLink>
    <RouterLink class="link" to="/chat">Chat</RouterLink>
    <RouterLink class="link" to="/profil">Profil</RouterLink>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: space-around;
  padding: 12px 10px;

  border-top: 1px solid #e5e7eb;
  background: white;
}

.link {
  text-decoration: none;
  color: #111827;
  font-weight: 600;
}
</style>