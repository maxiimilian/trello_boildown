<template>
    <div class="card">
        {{ board.name }}<br />
        {{ card.name }}<br />
        <span v-if="card.due !== null">Due: {{ due }}</span>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Card',
  props: ['card', 'board'],
  computed: {
    due () {
      return moment(this.card.due).fromNow()
    }
  }
}
</script>

<style>
.card {
    border: 1px solid grey;
    padding: 6px;
}
</style>
