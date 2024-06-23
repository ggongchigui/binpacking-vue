<script setup>
import {toRef, ref, watch} from "vue";
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'

const props = defineProps({
  enabled: {
    type: Boolean,
    required: true,
    default: false
  },
  label: {
    type: String,
    required: true,
    default: ''
  },
  subLabel: {
    type: String,
    required: false,
    default: null
  }
})

const emits = defineEmits(['update:enabled'])

// const enabled = ref(props.enabled)
const enabled = toRef(props, 'enabled')


</script>

<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch @update:modelValue="value => emits('update:enabled', value)"
            :class="[enabled ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
      <span aria-hidden="true"
            :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']"/>
    </Switch>
    <SwitchLabel as="span" class="ml-3 text-sm">
      <span class="font-medium text-gray-900">{{ props.label }}</span>
    </SwitchLabel>
  </SwitchGroup>
      <template v-if="props.subLabel">
        <span class="text-gray-500 text-sm">{{props.subLabel}}</span>
      </template>
</template>

<style scoped>

</style>