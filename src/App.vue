<script setup>
import { ref } from 'vue'

const currentView = ref('dashboard') // 'dashboard', 'upload', 'alerts'

const setView = (view) => {
  currentView.value = view
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="shield">🛡️</span>
          <h1>Vige</h1>
        </div>
        <nav class="nav">
          <button 
            @click="setView('dashboard')" 
            :class="['nav-btn', { active: currentView === 'dashboard' }]"
          >
            Dashboard
          </button>
          <button 
            @click="setView('upload')" 
            :class="['nav-btn', { active: currentView === 'upload' }]"
          >
            Upload Logs
          </button>
          <button 
            @click="setView('alerts')" 
            :class="['nav-btn', { active: currentView === 'alerts' }]"
          >
            Alerts
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="view">
        <div class="view-header">
          <h2>Dashboard</h2>
          <p class="text-secondary">Security event overview and statistics</p>
        </div>
        
        <div class="placeholder-content">
          <div class="placeholder-icon">📊</div>
          <h3>Dashboard Coming Soon</h3>
          <p class="text-secondary">Upload logs to see analytics and alerts here</p>
        </div>
      </div>

      <!-- Upload View -->
      <div v-if="currentView === 'upload'" class="view">
        <div class="view-header">
          <h2>Upload Logs</h2>
          <p class="text-secondary">Upload Windows Event Logs for analysis</p>
        </div>
        
        <div class="placeholder-content">
          <div class="placeholder-icon">📁</div>
          <h3>Upload Interface Coming Soon</h3>
          <p class="text-secondary">Drag and drop .evtx files here</p>
        </div>
      </div>

      <!-- Alerts View -->
      <div v-if="currentView === 'alerts'" class="view">
        <div class="view-header">
          <h2>Alerts</h2>
          <p class="text-secondary">Security alerts and detected threats</p>
        </div>
        
        <div class="placeholder-content">
          <div class="placeholder-icon">🚨</div>
          <h3>No Alerts Yet</h3>
          <p class="text-secondary">Upload logs to detect threats and generate alerts</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p class="text-muted">Vige v1.0 - Stay Vigilant. Stay Secure.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.shield {
  font-size: 2rem;
}

.logo h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary), #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text);
}

.nav-btn.active {
  background-color: var(--color-primary);
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.view {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.view-header {
  margin-bottom: 2rem;
}

.view-header h2 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.view-header p {
  margin: 0;
  font-size: 1rem;
}

/* Placeholder Content */
.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  padding: 3rem;
  text-align: center;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.placeholder-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.placeholder-content p {
  margin: 0;
  font-size: 1rem;
}

/* Footer */
.footer {
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 2rem;
  text-align: center;
}

.footer p {
  margin: 0;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-btn {
    flex: 1;
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .main-content {
    padding: 1rem;
  }

  .view-header h2 {
    font-size: 1.5rem;
  }

  .placeholder-icon {
    font-size: 3rem;
  }
}
</style>