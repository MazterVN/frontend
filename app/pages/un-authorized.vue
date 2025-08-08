<script setup lang="ts">
definePageMeta({
  layout: 'un-authorized',
})
</script>

<template>
  <div class="h-[calc(100vh-9rem)] flex items-center justify-center">
    <div class="text-center">
      <i class="icon-[heroicons--information-circle] w-14 h-14 text-md-error" />
      <h3 class="mt-2 text-lg font-semibold text-md-primary">
        Access Denied
      </h3>
      <p class="mt-1 text-sm text-md-secondary">
        It seems you don’t have the necessary permissions to access this application.
        <br>
        If you believe this is an error, please reach out to your administrator.
      </p>
      <div class="mt-6">
        <UButton
          to="tel:+85585598999"
          label="Contact Support"
        />
      </div>
    </div>
  </div>
</template>
