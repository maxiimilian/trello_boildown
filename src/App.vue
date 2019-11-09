<template>
  <div id="app">
    <TrelloAuth />
    <div v-if="connected">
        <BoardMultiSelect/>
    </div>
  </div>
</template>

<script>
import BoardMultiSelect from './components/BoardMultiSelect.vue'
import TrelloAuth from './components/TrelloAuth.vue'

export default {
  name: 'app',
  components: {
    BoardMultiSelect,
    TrelloAuth
  },
  computed: {
    connected () {
      return this.$store.state.trello_auth.connected
    }
  }
}
</script>

<style>
#app {
}
</style>
