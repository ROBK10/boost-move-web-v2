<template>
  <RouterLink to="/movin/kom-i-gang" class="link">
    <div class="card">

      <div class="top">
        <div class="kicker">Mental start</div>

      </div>

      <div class="content">
        <div class="title">
          Kom i gang mentalt
        </div>

        <div class="subtitle">
          Ta kontroll på dagen før den tar kontroll på deg
        </div>

        <div class="cta">
          <span>Start nå</span>
          <span class="arrow">→</span>
        </div>
      </div>

    </div>
  </RouterLink>
</template>

<style scoped>
.link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  display: grid;
  gap: 12px;
  transition: transform 0.15s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kicker {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f3f4f6;
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #111827;
}

.arrow {
  opacity: 0.7;
}
</style>