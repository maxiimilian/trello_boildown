<template>
  <div v-if="errors.length > 0" class="ui visible error message">
    <ul>
      <li v-for="(e, index) in errors" v-bind:key="index">{{ e }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ErrorDisplay',
  props: {
    errors: Array
  }
}
</script>
