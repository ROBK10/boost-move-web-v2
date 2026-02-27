<template>
  <nav class="nav">
    <RouterLink class="link" to="/hjem" active-class="active">
      Hjem
    </RouterLink>

    <RouterLink class="link" to="/movin" active-class="active">
      Movin
    </RouterLink>

    <!-- SENTERKNAPP -->
    <RouterLink class="link center" to="/min-helse" active-class="active-center">
      Min Helse
    </RouterLink>

    <RouterLink class="link" to="/chat" active-class="active">
      Chat
    </RouterLink>

    <RouterLink class="link" to="/profil" active-class="active">
      Profil
    </RouterLink>
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
  align-items: center;

  padding: 12px 10px;

  border-top: 1px solid #e5e7eb;
  background: white;
}

/* Standard link */
.link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s ease;
}

/* Aktiv vanlig fane */
.active {
  color: #111827;
}

/* Min Helse - større */
.center {
  font-size: 15px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 20px;
  background: #f3f4f6;
  transform: translateY(-6px);
}

/* Aktiv Min Helse */
.active-center {
  background: #111827;
  color: white;
  transform: translateY(-10px);
}
</style>