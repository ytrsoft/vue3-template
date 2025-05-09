<template>
  <div class="flex h-screen">
    <aside class="w-60 bg-gray-800 text-white p-4 space-y-4">
      <h1 class="text-xl font-bold mb-6">中台系统</h1>
      <router-link to="/dashboard" class="block px-3 py-2 rounded hover:bg-gray-700"
        >📊 仪表盘</router-link
      >
      <router-link to="/users" class="block px-3 py-2 rounded hover:bg-gray-700"
        >👤 用户管理</router-link
      >
    </aside>
    <main class="flex-1 bg-gray-100 p-6 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
