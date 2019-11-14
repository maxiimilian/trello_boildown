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
      // It is required for `tomorrow` to call moment() on `today` to get a cloned object!
      let due = moment(this.card.due)
      let today = moment().startOf('day')
      let tomorrow = moment(today).add(1, 'days')

      if (due.isBefore(today)) {
        // overdue
        return 'red'
      } else if (due.isBetween(today, tomorrow)) {
        // today
        return 'yellow'
      } else if (due.isBetween(tomorrow, moment(tomorrow).endOf('day'))) {
        // tomorrow
        return 'tomorrow'
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
.tomorrow {
    background-color: #f7eddc!important;
    border-color: #f7eddc!important;
}
</style>
