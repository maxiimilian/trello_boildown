<template>
  <div id="app" class="container">
    <div class="level">
        <TrelloAuth class="level-left"/>
        <BoardMultiSelect class="level-right" v-if="connected"/>
    </div>

    <div v-if="connected" id="cardlists">
        <h3 class="title">Overdue ({{ cards_overdue.length }})</h3>
        <CardList v-bind:cards="cards_overdue"/>

        <h3 class="title">Due ({{ cards_due.length }})</h3>
        <CardList v-bind:cards="cards_due"/>

        <h3 class="title">Not scheduled</h3>
        <CardList v-bind:cards="cards_not_scheduled"/>
    </div>
  </div>
</template>

<script>
import BoardMultiSelect from './components/BoardMultiSelect.vue'
import TrelloAuth from './components/TrelloAuth.vue'
import CardList from './components/CardList.vue'

export default {
  name: 'app',
  components: {
    BoardMultiSelect,
    TrelloAuth,
    CardList
  },
  computed: {
    connected () {
      return this.$store.state.trello_auth.connected
    },
    cards () {
      return this.$store.state.cards
    },
    cards_not_scheduled () {
      return this.$store.getters.cards_not_scheduled
    },
    cards_overdue () {
      return this.$store.getters.cards_overdue
    },
    cards_due () {
      return this.$store.getters.cards_due
    }
  }
}
</script>

<style>
#app {
    width: 100%;
}
#trello_auth {
}
#board_multi_select {
}
</style>
