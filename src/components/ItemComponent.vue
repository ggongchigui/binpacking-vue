<script setup>
import {XCircleIcon, DocumentDuplicateIcon} from "@heroicons/vue/24/outline";
import {computed, defineProps, ref, watch} from 'vue'
import {PlusCircleIcon, MinusCircleIcon} from "@heroicons/vue/24/outline";

import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {EllipsisVerticalIcon, EllipsisHorizontalIcon} from '@heroicons/vue/20/solid'

const props = defineProps({
  item: {
    type: Object,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emits = defineEmits(['updateItem', 'deleteItem', 'duplicateItem'])

const itemWidth = ref(props.item.width)
const itemHeight = ref(props.item.height)
const itemCount = ref(props.item.count)
const widthId = `width-${props.item.id}`
const heightId = `height-${props.item.id}`
const countId = `count-${props.item.id}`
const duplicateItem = () => {
  emits('duplicateItem', props.item)
}

const deleteItem = () => {
  emits('deleteItem', props.item)
}

const countDown = () => {
  if (props.disabled) return null
  if (itemCount.value > 1) {
    itemCount.value--
  }
}

const countUp = () => {
  if (props.disabled) return null
  itemCount.value++
}

watch([itemWidth, itemHeight, itemCount], ([newWidth, newHeight, newCount]) => {
  emits('updateItem', {
    id: props.item.id,
    width: newWidth,
    height: newHeight,
    count: newCount
  })
})

</script>

<template>
  <div :class="['w-full grid grid-cols-12 gap-x-2 sm:gap-x-4 items-center']">
    <div class="col-span-1 text-center" :class="props.item.allocateError ? 'text-red-500' : 'text-gray-900'">
      {{ item.id }}
    </div>
    <div class="col-span-3">
      <label :for="widthId" class="sr-only">폭(mm)</label>
      <div>
        <input type="number" name="width" :id="widthId" class="form-control"
               :class="props.item.allocateError ? 'ring-red-400 focus:ring-red-600' : 'ring-gray-300 focus:ring-indigo-600'"
               v-model="itemWidth"
               @click="$event.target.select()" :disabled="props.disabled"/>
      </div>
    </div>
    <div class="col-span-3">
      <label :for="heightId" class="sr-only">높이(mm)</label>
      <div>
        <input type="number" name="height" :id="heightId" class="form-control"
               :class="props.item.allocateError ? 'ring-red-400 focus:ring-red-600' : 'ring-gray-300 focus:ring-indigo-600'"
               v-model="itemHeight"
               @click="$event.target.select()" :disabled="props.disabled"/>
      </div>
    </div>
    <div class="col-span-3">
      <label :for="countId" class="sr-only">갯수</label>
      <div class="flex items-center justify-between gap-x-2 sm:gap-x-4">
        <MinusCircleIcon class="w-9 h-9 cursor-pointer select-none hidden sm:block" @click="countDown"/>
        <input type="number" name="count" :id="countId" class="form-control text-center"
               :class="props.item.allocateError ? 'ring-red-400 focus:ring-red-600' : 'ring-gray-300 focus:ring-indigo-600'"
               v-model="itemCount"
               @click="$event.target.select()" :disabled="props.disabled"/>
        <PlusCircleIcon class="w-9 h-9 cursor-pointer select-none hidden sm:block" @click="countUp"/>
      </div>
    </div>
<!--    <div class="col-span-2 items-center justify-start gap-x-2 sm:gap-x-4 hidden sm:flex">-->
<!--      <button type="button" @click="duplicateItem" :disabled="props.disabled"-->
<!--              class="inline-flex rounded-md px-2.5 py-3 text-sm font-semibold bg-white text-gray-900 ring-1 ring-inset ring-gray-300 shadow-sm hover:bg-gray-50">-->
<!--        &lt;!&ndash;        <DocumentDuplicateIcon class="-ml-0.5 h-5 w-5" aria-hidden="true"/>&ndash;&gt;-->
<!--        <span class="hidden sm:block">복사</span>-->
<!--      </button>-->
<!--      <button type="button" @click="deleteItem" :disabled="props.disabled"-->
<!--              class="inline-flex rounded-md bg-red-600 px-2.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">-->
<!--        &lt;!&ndash;        <XCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true"/>&ndash;&gt;-->
<!--        <span class="hidden sm:block">삭제</span>-->
<!--      </button>-->
<!--    </div>-->

    <div class="col-span-2 text-center">

      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton :disabled="props.disabled"
              class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none">
            <span class="sr-only">Open options</span>
            <EllipsisHorizontalIcon class="h-7 w-7" aria-hidden="true"/>
          </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems
              class="absolute right-0 bottom-0 z-10 mt-2 w-24 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="">
              <MenuItem>
                <button type="button" @click="duplicateItem" :disabled="props.disabled"
                        class="inline-flex px-4 py-3 text-sm font-semibold bg-white text-gray-900 w-full rounded-t-md hover:bg-gray-300">
                  <DocumentDuplicateIcon class="-ml-0.5 h-5 w-5" aria-hidden="true"/>
                  <span>복사</span>
                </button>
              </MenuItem>
              <MenuItem>
                <button type="button" @click="deleteItem" :disabled="props.disabled"
                        class="inline-flex px-4 py-3 text-red-600 text-sm font-semibold w-full rounded-b-md hover:bg-red-500 hover:text-gray-50">
                  <XCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true"/>
                  <span>삭제</span>
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>

    </div>
  </div>
  <div class="text-sm text-left text-red-500 px-0 sm:pl-2 mt-1" v-if="props.item.allocateError">
    {{ props.item.allocateError }}
  </div>
  <!--  <div class="w-full flex items-center justify-between gap-x-4">-->
  <!--    <div class="w-full flex items-center justify-start gap-x-4">-->
  <!--      <div>-->
  <!--        <label for="width" class="sr-only">폭(mm)</label>-->
  <!--        <div class="mt-2">-->
  <!--          <input type="number" name="width" id="width" class="form-control" v-model="itemWidth"-->
  <!--                 @click="$event.target.select()"/>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <label for="height" class="sr-only">높이(mm)</label>-->
  <!--        <div class="mt-2">-->
  <!--          <input type="number" name="height" id="height" class="form-control" v-model="itemHeight"-->
  <!--                 @click="$event.target.select()"/>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div>-->
  <!--      test-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>