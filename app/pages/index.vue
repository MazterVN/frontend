<script setup lang="ts">
</script>

<template>
  <NuxtImg
    provider="cloudfront"
    placeholder
    class="w-full h-[calc(100vh-4rem)] object-cover object-center"
    src="s3://pks-bucket-prod/assets/pks-home.jpeg"
    :modifiers="{ edits: {} }"
  />
</template>
