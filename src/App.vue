<template>
  <div id="app" class="ui container">
    <div id="header">
        <h1 class="ui header left floated">Trello Boildown</h1>
        <button class="ui negative button right floated" v-on:click="disconnect">Disconnect</button>
    </div>
    <div class="ui clearing divider"></div>

    <div>
        <TrelloAuth />
        <BoardMultiSelect v-if="connected"/>
    </div>
    <div class="ui clearing divider"></div>

    <div class="" v-if="connected" id="cardlists">
        <CardList header="Overdue" v-bind:cards="cards_overdue" initially_collapsed/>
        <CardList header="Due" v-bind:cards="cards_due"/>
        <CardList header="Not Scheduled" v-bind:cards="cards_not_scheduled"/>
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
  },
  methods: {
    disconnect () {
      this.$store.commit('set_connection_state', false)
    }
  }
}
</script>

<style>
#header {
    padding-top: 14px;
}
</style>
