<template>
  <div id="app">
    <TrelloAuth />
    <div v-if="connected">
        <BoardMultiSelect/>

        <div>
            <ul>
                <li v-for="c in cards" v-bind:key="c.id">{{ c.name }}</li>
            </ul>
        </div>
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
    },
    cards () {
      return this.$store.state.cards
    }
  }
}
</script>

<style>
#app {
}
</style>
