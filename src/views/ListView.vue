<template>
    <div v-if="connected" id="list">
        <CardList header="Overdue" v-bind:cards="cards_overdue" initially_collapsed/>
        <CardList header="Due" v-bind:cards="cards_due"/>
        <CardList header="Not Scheduled" v-bind:cards="cards_not_scheduled" initially_collapsed/>
    </div>
</template>

<script>
import CardList from '../components/CardList.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ListView',
  components: {
    CardList
  },
  computed: {
    ...mapState({
      'connected': state => state.trello_auth.connected
    }),
    ...mapGetters([
      'cards_due',
      'cards_overdue',
      'cards_not_scheduled'
    ])
  }

}
</script>

<style>

</style>
