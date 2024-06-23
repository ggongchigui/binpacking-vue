<script setup>
import {PlusCircleIcon} from "@heroicons/vue/24/outline";
import {ref, onMounted, nextTick} from "vue";
import ItemComponent from "@/components/ItemComponent.vue";
import ToggleComponent from "@/components/ToggleComponent.vue";

const pageWidth = ref(1220)
const pageHeight = ref(50000)
const pageMargin = ref(10)
const itemMargin = ref(5)
const rotate = ref(true)
// const group = ref(true)
const showCalculate = ref(false)


const items = ref([])

const itemValidator = (widthValue, heightValue, pageWidthValue, pageHeightValue, countValue) => {
  if (!widthValue && !heightValue) {
    return '조각 폭과 높이를 입력하세요.'
  } else if (!widthValue) {
    return '조각 폭을 입력하세요.'
  } else if (!heightValue) {
    return '조각 높이를 입력하세요.'
  } else if ((widthValue <= pageWidthValue && heightValue <= pageHeightValue) || (widthValue <= pageHeightValue && heightValue <= pageWidthValue)) {
    return null
  } else if (!countValue) {
    return '조각 갯수를 입력하세요.'
  } else {
    return '조각 크기가 롤 크기를 초과합니다.'
  }
}

const addItemMethod = (width, height, count, focus) => {
  // let canAllocate = (width <= pageWidth.value && height <= pageHeight.value) || (width <= pageHeight.value && height <= pageWidth.value)
  let id = items.value.length === 0 ? 1 : Math.max(...items.value.map(item => item.id)) + 1
  items.value.push({
    id: id,
    width,
    height,
    count,
    allocateError: itemValidator(width, height, pageWidth.value, pageHeight.value, count)
  })
  if (focus === true) {
    const widthId = `width-${id}`
    nextTick(() => {
      document.getElementById(widthId).select()
    })
  }
}
const addItem = () => {
  addItemMethod(0, 0, 1, true)
}

const duplicateItem = (item) => {
  addItemMethod(item.width, item.height, item.count, true)
}

const deleteItem = (item) => {
  items.value = items.value.filter(i => i.id !== item.id)
}

const updateItem = (newItem) => {
  items.value = items.value.map(oldItem => oldItem.id === newItem.id ? {
    ...newItem,
    allocateError: itemValidator(newItem.width, newItem.height, pageWidth.value, pageHeight.value, newItem.count)
  } : oldItem)
}

onMounted(() => {
  Array(10).fill(1).map(
      temp => addItemMethod(parseInt((Math.random() + 2) * 100), parseInt((Math.random() + 2) *300), 1, false)
  )
  // addItemMethod(parseInt(pageWidth.value / 10), parseInt(pageHeight.value / 10), 1, false)
})

const calculate = async () => {
  const body = {
    pageWidth: pageWidth.value,
    pageHeight: pageHeight.value,
    pageMargin: pageMargin.value,
    itemMargin: itemMargin.value,
    rotate: rotate.value,
    // group: group.value,
    items: items.value
  }
  const response = await fetch('/binpack/calculate', {method: "POST", body: JSON.stringify(body)})
  const data = await response.json()
  console.log(data)
}

</script>

<template>
  <div class="grid grid-cols-12 sm:gap-x-6">
    <div class="col-span-full sm:col-span-5 mb-8 sm:mb-0">
      <div class="mb-4 sm:mb-6">
        <h3 class="text-base font-semibold leading-7 text-gray-900 mb-4">원판 크기</h3>
        <div class="grid grid-cols-2 gap-x-2 mb-4">
          <div class="col-span-1">
            <label for="width" class="block text-sm font-medium leading-6 text-gray-900">폭(mm)</label>
            <div class="mt-2">
              <input type="number" name="width" id="width" class="form-control" v-model="pageWidth"
                     @click="$event.target.select()" :disabled="showCalculate"/>
            </div>
          </div>
          <div class="col-span-1">
            <label for="height" class="block text-sm font-medium leading-6 text-gray-900">높이(mm)</label>
            <div class="mt-2">
              <input type="number" name="height" id="height" class="form-control" v-model="pageHeight"
                     @click="$event.target.select()" :disabled="showCalculate"/>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-2">
          <div class="col-span-1">
            <label for="height" class="block text-sm font-medium leading-6 text-gray-900">조각 여백(mm)</label>
            <div class="mt-2">
              <input type="number" name="margin" id="margin" class="form-control" v-model="itemMargin"
                     @click="$event.target.select()" :disabled="showCalculate"/>
              <span class="text-sm text-gray-400">조각 간의 최소 간격입니다.</span>
            </div>
          </div>
          <div class="col-span-1">
            <label for="height" class="block text-sm font-medium leading-6 text-gray-900">원판 여백(mm)</label>
            <div class="mt-2">
              <input type="number" name="pageMargin" id="pageMargin" class="form-control" v-model="pageMargin"
                     @click="$event.target.select()" :disabled="showCalculate"/>
              <span class="text-sm text-gray-400">원판 테두리의 여백을 설정합니다.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6 sm:mb-12">
        <!--        {{rotate}}-->
<!--        <div class="mb-4">-->
          <ToggleComponent label="조각을 회전해 배열하는 것을 허용합니다." :enabled="rotate" @update:enabled="value => rotate = value"/>
<!--        </div>-->
<!--        <ToggleComponent label="같은 크기의 조각을 비슷한 위치에 모아서 배열합니다." sub-label="이 옵션을 끌 경우 입력한 순서를 가급적 유지하며 배열합니다."-->
<!--                         :enabled="group" @update:enabled="value => group = value"/>-->
      </div>

      <div>
        <!--        <button type="button" @click="showCalculate = true" v-if="showCalculate === false"-->
        <button type="button" @click="calculate" v-if="showCalculate === false"
                class="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          재단 계산
        </button>
        <button type="button" @click="showCalculate = false" v-if="showCalculate === true"
                class="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          리셋
        </button>

      </div>
    </div>
    <div class="col-span-full sm:col-span-7">
      <div class="mb-6 sm:mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-base font-semibold leading-7 text-gray-900">조각 목록</h3>
          <PlusCircleIcon class="w-6 h-6 text-indigo-500 cursor-pointer select-none" @click="addItem">랜덤 추가
          </PlusCircleIcon>
        </div>
        <div class="w-full grid grid-cols-12 gap-x-4 mb-1">
          <div class="col-span-1 text-center">#</div>
          <div class="col-span-3 text-center">폭(mm)</div>
          <div class="col-span-3 text-center">높이(mm)</div>
          <div class="col-span-3 text-center">갯수</div>
        </div>
        <div>
          <div v-for="item in items.slice().reverse()" :key="item.id" class="mb-4">
            <ItemComponent :item="item" @duplicateItem="duplicateItem" @deleteItem="deleteItem"
                           @updateItem="updateItem" :disabled="showCalculate"/>
            <!--          <div v-for="item in items.slice().reverse()">{{item}}</div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#bins-container {
  display: flex;
  flex-wrap: wrap;
}

.bin {
  border: 1px solid #000;
  margin: 10px;
  position: relative;
}

.item {
  position: absolute;
  border: 1px solid #000;
  background-color: rgba(0, 150, 0, 0.5);
  box-sizing: border-box;
}
</style>