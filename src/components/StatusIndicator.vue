<template>
    <div>
        <i v-if="status == 'ok'" style="color: green;" class="check circle icon"></i>
        <i v-if="status == 'loading'" class="notched circle loading icon"></i>
        <i v-if="status == 'error'" style="color: red;" class="exclamation circle icon"></i>
    </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
  props: ['status']
}
</script>
