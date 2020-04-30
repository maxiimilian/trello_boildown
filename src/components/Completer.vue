<template>
  <div>
    <a>
      <i @click="check()" class="check circle icon" v-bind:class="click_counter == 0 ? 'outline' : ''"></i>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Completer',
  data () {
    return {
      click_counter: 0
    }
  },
  methods: {
    check () {
      // Needs to be called twice to trigger `completed` event
      if (this.click_counter < 1) {
        this.click_counter += 1
      } else {
        this.$emit('completed')
        this.click_counter = 0
      }
    }
  }
}
</script>

<style scoped>
a {
  color: rgba(0,0,0,.4);
}
</style>
