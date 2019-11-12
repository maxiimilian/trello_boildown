<template>
    <div class="ui card">
        <div class="content">
            <!--<div class="ui label">{{ board.name }}</div>-->
            <div class="header">{{ card.name }}</div>
            <div class="meta"><a :href="board.shortUrl" target="_blank">{{ board.name }}</a></div>
        </div>
        <div class="extra content">
            <div class="left floated">
                <div v-if="card.due !== null" class="ui label due" v-bind:class="due_color" v-bind:data-tooltip="due.tooltip" data-position="top left" data-inverted="">{{ due.short }}</div>
            </div>
            <div class="right floated">
                <a :href="card.shortUrl" target="_blank"><i class="external square alternate icon"></i></a>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Card',
  props: ['card', 'board'],
  computed: {
    due () {
      let due = moment(this.card.due)
      return {
        short: due.calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'DD.MM.YY'
        }),
        tooltip: due.format('DD.MM.YY, HH:mm')
      }
    },
    due_color () {
      if (this.card.due < moment().startOf('day')) {
        // overdue
        return 'red'
      }
      if (this.card.due >= moment().startOf('day') && this.card.due < moment().endOf('day')) {
        // today
        return 'yellow'
      }
      return ''
    }
  }
}
</script>

<style scoped>
.due {
    cursor: pointer;
}
</style>
