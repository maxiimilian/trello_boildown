<template>
  <div id="app">
    <TrelloAuth />
    <BoardMultiSelect v-if="connected"/>

    <div v-if="connected" id="cardlists">
        <h2>Overdue ({{ cards_overdue.length }})</h2>
        <CardList v-bind:cards="cards_overdue"/>

        <h2>Due ({{ cards_due.length }})</h2>
        <CardList v-bind:cards="cards_due"/>

        <h2>Not scheduled</h2>
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
    float: left;
}
#board_multi_select {
    float: right;
}
#cardlists {
    clear: both;
}
</style>
