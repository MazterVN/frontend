<script setup lang="ts">
definePageMeta({
  layout: 'no-layout',
})

const supabase = useSupabaseClient()
const runtimeConfig = useRuntimeConfig()
const redirectUrl = runtimeConfig.public.redirectUrl

const email = ref('')
const isLoading = ref(false)
const loadingProvider = ref('')
const showSuccess = ref(false)
const errorMessage = ref('')

const signInWithGoogle = async () => {
  isLoading.value = true
  loadingProvider.value = 'google'
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })
  if (error) {
    errorMessage.value = error.message
    return
  }
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
    loadingProvider.value = ''
  }, 2000)
}

const signInWithApple = async () => {
  isLoading.value = true
  loadingProvider.value = 'apple'
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: redirectUrl,
    },
  })
  if (error) {
    errorMessage.value = error.message
    return
  }
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
    loadingProvider.value = ''
  }, 2000)
}

const signInWithOtp = async () => {
  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលដែលត្រឹមត្រូវ'
    return
  }

  isLoading.value = true
  loadingProvider.value = 'otp'
  errorMessage.value = ''

  // Simulate sending magic link
  setTimeout(async () => {
    showSuccess.value = true
    isLoading.value = false
    loadingProvider.value = ''

    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    if (error) {
      errorMessage.value = error.message
      return
    }

    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  }, 2000)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !isLoading.value) {
    signInWithOtp()
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-17 h-17 mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
          <NuxtImg
            class="w-[68px] object-cover object-center rounded-2xl"
            src="/logo.png"
          />
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          សូមស្វាគមន៍
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          ចូលទៅកាន់ប្រព័ន្ធគ្រប់គ្រងសាលា ពន្លកខ្មែរ
        </p>
      </div>

      <!-- Main Card -->
      <UCard class="shadow-xl">
        <template #header>
          <div class="text-center">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              ចូលទៅកាន់គណនីរបស់អ្នក
            </h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Error Alert -->
          <UAlert
            v-if="errorMessage"
            icon="i-herocons-exclamation-triangle"
            color="error"
            variant="soft"
            :title="errorMessage"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
            @close="errorMessage = ''"
          />

          <!-- Success Alert -->
          <UAlert
            v-if="showSuccess"
            icon="i-heroicons-check-circle"
            color="success"
            variant="soft"
            title="Magic link បានផ្ញើ!"
            description="ពិនិត្យអ៊ីមែលរបស់អ្នក ហើយចុចលើតំណភ្ជាប់ដើម្បីចូលប្រព័ន្ធ។"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
            @close="showSuccess = false"
          />

          <!-- Email Form -->
          <div class="space-y-4">
            <UFormField
              label="អាសយដ្ឋានអ៊ីមែល"
              name="email"
              required
            >
              <UInput
                v-model="email"
                type="email"
                placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
                icon="i-heroicons-envelope"
                size="lg"
                :disabled="isLoading"
                @keypress="handleKeyPress"
              />
            </UFormField>

            <UButton
              block
              size="lg"
              :loading="loadingProvider === 'otp'"
              :disabled="isLoading"
              @click="signInWithOtp"
            >
              <template #leading>
                <UIcon name="i-heroicons-paper-airplane" />
              </template>
              {{ loadingProvider === 'otp' ? 'Sending magic link...' : 'Send magic link' }}
            </UButton>
          </div>

          <!-- Divider -->
          <USeparator
            label="Or continue with"
            :ui="{
              label: 'text-gray-500 dark:text-gray-400 font-medium',
            }"
          />

          <!-- Social Login Buttons -->
          <div class="space-y-3">
            <!-- Google Button -->
            <UButton
              block
              size="lg"
              color="neutral"
              variant="ghost"
              :loading="loadingProvider === 'google'"
              :disabled="isLoading"
              class="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="signInWithGoogle"
            >
              <template #leading>
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </template>
              <span class="text-gray-700 dark:text-gray-300">
                {{ loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google' }}
              </span>
            </UButton>

            <!-- Apple Button -->
            <UButton
              block
              size="lg"
              color="neutral"
              variant="solid"
              :loading="loadingProvider === 'apple'"
              :disabled="isLoading"
              class="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 border-0"
              @click="signInWithApple"
            >
              <template #leading>
                <UIcon
                  name="i-simple-icons-apple"
                  class="w-5 h-5 text-white dark:text-black"
                />
              </template>
              <span class="text-white dark:text-black font-medium">
                {{ loadingProvider === 'apple' ? 'Connecting...' : 'Continue with Apple' }}
              </span>
            </UButton>
          </div>
        </div>

        <template #footer>
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              ដោយការចូលប្រព័ន្ធ អ្នកយល់ព្រមទៅតាម
              <ULink
                to="#"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                លក្ខខណ្ឌនៃសេវាកម្ម
              </ULink>
              and
              <ULink
                to="#"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                គោលការណ៍ឯកជនភាព
              </ULink>
            </p>
          </div>
        </template>
      </UCard>

      <!-- Help Text -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ត្រូវការជំនួយ?
          <ULink
            to="#"
            class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            ទាក់ទងបុគ្គលិកជំនួយ
          </ULink>
        </p>
      </div>
    </div>
  </div>
</template>
