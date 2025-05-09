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
    <main class="flex flex-col flex-1 overflow-auto">
      <div class="flex-none h-[56px] border-b-[1px] border-b-[rgba(5,5,5,0.06)]">
        <Header />
      </div>
      <section class="flex-1 bg-gray-100 p-4">
        <router-view />
      </section>
    </main>
  </div>
</template>
