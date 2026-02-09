<template>
  <header class="header">
    <div class="inner">
      <!-- Brand -->
      <div class="brand">
        <div class="logo">📝</div>
        <div class="brandText">
          <div class="title">Journaling Analyzer</div>
          <div class="subtitle">Track emotions • reflect • grow</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="nav">
        <RouterLink to="/write" class="tab" active-class="active">
          Write Journaling
        </RouterLink>

        <RouterLink to="/daily" class="tab" active-class="active">
          Daily Report
        </RouterLink>

        <RouterLink to="/monthly" class="tab" active-class="active">
          Monthly Report
        </RouterLink>
      </nav>

      <!-- Action -->
      <div class="actions">
        <RouterLink to="/write" class="primaryBtn">
          + New Entry
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router"
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.9);
}

.inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 18px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 14px;
  align-items: center;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}
.logo {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 18px;
  border: 1px solid rgba(229, 231, 235, 0.9);
  background: linear-gradient(180deg, #ffffff, #f6f7fb);
  box-shadow: 0 10px 25px rgba(17, 24, 39, 0.06);
}
.brandText .title {
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #111827;
  line-height: 1.2;
}
.brandText .subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Nav Tabs */
.nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid rgba(229, 231, 235, 0.9);
  background: linear-gradient(180deg, #ffffff, #fafafa);
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.05);
}

.tab {
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 999px;
  color: #374151;
  transition: transform 0.12s ease, background 0.12s ease, color 0.12s ease;
  white-space: nowrap;
}
.tab:hover {
  background: rgba(17, 24, 39, 0.06);
  transform: translateY(-1px);
}
.active {
  color: #111827;
  background: #111827;
  color: #fff;
  box-shadow: 0 10px 22px rgba(17, 24, 39, 0.18);
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
}
.primaryBtn {
  text-decoration: none;
  font-weight: 800;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.15);
  background: linear-gradient(180deg, #111827, #0b1220);
  color: #fff;
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.22);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.primaryBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 36px rgba(17, 24, 39, 0.26);
}

/* Responsive */
@media (max-width: 900px) {
  .inner {
    grid-template-columns: 1fr;
  }
  .actions {
    justify-content: flex-start;
  }
  .nav {
    justify-content: flex-start;
  }
}
</style>
