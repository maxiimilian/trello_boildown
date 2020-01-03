<template>
    <div v-bind:id="dow">
        {{ dow_moment.format('dd, DD.MM.') }}
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
    return {
      dow_moment: moment().weekday(this.dow)
    }
  }
}
</script>

<style scoped>
</style>
