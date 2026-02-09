<template>
  <header class="header">
    <div class="inner">
      <!-- Brand -->
      <div class="brand">
        <div class="logo">📝</div>
        <div class="brandText">
          <div class="title">Journaling Analyzer</div>
          <div class="subtitle">Reflect • Track • Grow</div>
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eef2f7;
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
  background: linear-gradient(180deg, #ffffff, #f6f7ff);
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 22px rgba(31, 41, 55, 0.06);
}
.title {
  font-weight: 900;
  color: #1f2937;
  line-height: 1.2;
}
.subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Nav */
.nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(31, 41, 55, 0.06);
}

.tab {
  text-decoration: none;
  font-weight: 800;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 999px;
  color: #4b5563;
  transition: background 0.12s ease, transform 0.12s ease;
  white-space: nowrap;
}
.tab:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

/* Active tab = soft pastel */
.active {
  color: #1f2937;
  background: linear-gradient(180deg, #eef2ff, #ffffff);
  border: 1px solid #e0e7ff;
  box-shadow: 0 10px 22px rgba(99, 102, 241, 0.12);
}

/* Button */
.actions {
  display: flex;
  justify-content: flex-end;
}
.primaryBtn {
  text-decoration: none;
  font-weight: 900;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid #e0e7ff;
  background: linear-gradient(180deg, #f5f3ff, #ffffff);
  color: #3730a3;
  box-shadow: 0 14px 28px rgba(99, 102, 241, 0.12);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.primaryBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(99, 102, 241, 0.16);
}

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
