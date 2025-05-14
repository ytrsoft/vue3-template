<template>
  <div class="flex h-screen">
    <aside class="px-4 overflow-auto bg-[#001529]">
      <div class="flex-none h-[56px]">
        <Logo />
      </div>
      <section class="flex-1 py-2">
        <Menu />
      </section>
    </aside>
    <main class="flex-1 flex flex-col overflow-hidden pt-[56px] relative">
      <div class="w-full h-[56px] border-b border-gray-200 bg-white fixed top-0">
        <Header />
      </div>
      <section class="flex-1 bg-gray-100 p-4 overflow-auto">
        <router-view />
      </section>
    </main>
  </div>
</template>
