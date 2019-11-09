<template>
  <div id="app">
    <TrelloAuth />
    <div v-if="connected">
        <BoardMultiSelect/>

        <div>
            <ul>
                <li v-for="c in cards_overdue" v-bind:key="c.id">{{ c.name }}</li>
            </ul><br />
            <ul>
                <li v-for="c in cards" v-bind:key="c.id">{{ c.name }}</li>
            </ul><br />
            <ul>
                <li v-for="c in cards_not_scheduled" v-bind:key="c.id">{{ c.name }}</li>
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
    },
    cards_overdue () {
      return this.$store.state.cards_overdue
    },
    cards_not_scheduled () {
      return this.$store.state.cards_not_scheduled
    }
  }
}
</script>

<style>
#app {
}
</style>
