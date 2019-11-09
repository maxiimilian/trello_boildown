<template>
    <div class="list">
        <Card v-for="c in cards" v-bind:key="c.id" v-bind:card="c" v-bind:board="boards[c.board_id]"/>
    </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'CardList',
  components: {
    Card
  },
  props: ['cards'],
  computed: {
    boards () {
      return this.$store.state.boards
    }
  }
}
</script>
