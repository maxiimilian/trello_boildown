<template>
    <div class="card box">
        <span class="tag">{{ board.name }}</span><br />
        <p class="is-medium">{{ card.name }}</p>
        <span v-if="card.due !== null">Due: {{ due }}</span><br />
        <a :href="card.shortUrl" target="_blank">Link</a>
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
    padding: 6px;
}
</style>
