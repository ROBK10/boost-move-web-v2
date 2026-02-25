<script setup>
</script>
<template>
  <RouterLink to="/movin/knowzone" class="link">
    <div class="card">
      <div class="top">
        <div class="kicker">Dagens innsikt</div>
       </div>

      <div class="message">
        Skap din egen fremtid i dag
      </div>

    </div>
  </RouterLink>
</template>


<style scoped>
.link { text-decoration: none; color: inherit; display: block; }

.card {
  background: white;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  display: grid;
  gap: 10px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kicker {
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f3f4f6;
}

.message {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
  color: #111827;
}

.arrow { opacity: 0.8; }
</style>