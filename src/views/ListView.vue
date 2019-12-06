<template>
    <div v-if="connected" id="list">
        <CardList header="Overdue" v-bind:cards="cards_overdue" initially_collapsed/>
        <CardList header="Due" v-bind:cards="cards_due"/>
        <CardList header="Not Scheduled" v-bind:cards="cards_not_scheduled"/>
    </div>
</template>

<script>
import CardList from '../components/CardList.vue'

export default {
  name: 'ListView',
  components: {
    CardList
  },
  computed: {
    connected () {
      return this.$store.state.trello_auth.connected
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

</style>
