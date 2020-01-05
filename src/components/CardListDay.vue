<template>
    <div v-bind:id="dow">
        <strong v-if="is_today">{{ dow_moment.format('dd, DD.MM.') }}</strong>
        <span v-if="!is_today">{{ dow_moment.format('dd, DD.MM.') }}</span>
        <Card v-for="c in cards" v-bind:key="c.id" v-bind:card="c" v-bind:board="boards[c.board_id]"/>
    </div>
</template>

<script>
import moment from 'moment'
/*import sort_cards_by_due from '../store/index.js'*/
import Card from '../components/Card.vue'

export default {
  name: 'CardListDay',
  components: {
    Card
  },
  props: {
    dow: Number
  },
  computed: {
    cards () {
      let cards = this.$store.state.cards
      return cards.filter(c => moment(c.due).isSame(this.dow_moment, 'day'))
    },
    boards () {
      return this.$store.state.boards
    }
  },
  data () {
    let dow_moment = moment().locale('de').weekday(this.dow)
    return {
      dow_moment: dow_moment,
      is_today: moment().isSame(dow_moment, 'day')
    }
  }
}
</script>

<style scoped>
</style>
