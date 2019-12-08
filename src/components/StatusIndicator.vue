<template>
    <div>
        <div
            class="status"
            v-if="status == 'ok'"
        >
            <i class="check circle icon" style="color: green;"></i>
        </div>

        <div
            class="status"
            v-if="status == 'loading'"
        >
            <i class="notched circle loading icon"></i>
        </div>

        <div
            class="status"
            v-if="status == 'error'"
            v-bind:data-tooltip="msg"
            data-position="bottom right"
            data-inverted=""
        >
            <i class="exclamation circle icon" style="color: red;"></i>
        </div>
    </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
  props: {
    status: String,
    msg: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
div.status {
    cursor: pointer;
}
</style>
