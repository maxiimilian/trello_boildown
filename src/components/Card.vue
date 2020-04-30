<template>
    <div class="ui card">
        <div class="content">
            <div class="right floated meta">
              <StatusIndicator :status="status" :msg="status_msg"/>
              <Completer v-on:completed="mark_completed()" v-if="status == 'hidden'"></Completer>
            </div>
            <div class="header"><a :href="card.shortUrl" target="_blank">{{ card.name }}</a></div>
            <div class="meta"><a :href="board.shortUrl" target="_blank">{{ board.name }}</a></div>
        </div>
        <div class="extra content">
            <div class="left floated">
                <div v-if="card.due !== null" class="ui label due" v-bind:class="due_color" v-bind:data-tooltip="due.tooltip" data-position="top left" data-inverted="">{{ due.short }}</div>
            </div>
            <div class="right floated">
                <a v-on:click="reschedule(1)" v-bind:data-tooltip="get_reschedule_tooltip(1)" data-position="top right" data-inverted="" class="reschedule_button">+1d</a>
                <a v-on:click="reschedule(2)" v-bind:data-tooltip="get_reschedule_tooltip(2)" data-position="top right" data-inverted="" class="reschedule_button">+2d</a>
                <a v-on:click="reschedule(7)" v-bind:data-tooltip="get_reschedule_tooltip(7)" data-position="top right" data-inverted="" class="reschedule_button">+1w</a>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import StatusIndicator from './StatusIndicator'
import Completer from './Completer'

export default {
  name: 'Card',
  props: ['card', 'board'],
  components: {
    StatusIndicator,
    Completer
  },
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
        tooltip: due.format('dd, DD.MM.YY, HH:mm')
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
    },
    list_backlog_id () {
      let backlog = this.board.lists.find(l => l.name === 'Backlog')
      if (backlog === undefined) {
        return false
      }
      return backlog.id
    },
    list_week_id () {
      let week = this.board.lists.find(l => l.name === 'Week')
      if (week === undefined) {
        return false
      }
      return week.id
    },
    list_completed_id () {
      let completed = this.board.lists.find(l => l.name === 'Completed')
      if (completed === undefined) {
        return false
      }
      return completed.id
    },
    advanced_rescheduling () {
      /*
      True, if a card is capable of advanced rescheduling.
      That means, Week and Backlog columns are present and card is moved
      to correct column on rescheduling
      */
      return self.list_week_id !== false && self.list_backlog_id !== false
    }
  },
  data () {
    return {
      status: 'hidden',
      status_msg: ''
    }
  },
  methods: {
    reschedule (days) {
      let new_due = moment(this.card.due).add(days, 'days')
      let data = {
        due: new_due.toISOString()
      }

      // Advanced rescheduling is available if Week and Backlog column are defined
      // Only move column if new due date is after now.
      if (this.advanced_rescheduling && new_due.isAfter()) {
        if (moment().week() !== new_due.week()) {
          data['idList'] = this.list_backlog_id
        } else {
          data['idList'] = this.list_week_id
        }
      }

      this.update_card(data)
    },
    mark_completed () {
      // Set current time and date as due date and mark as completed
      let data = {
        due: moment().toISOString(),
        dueComplete: true
      }

      // If available, move to the top of list `completed`
      if (this.list_completed_id) {
        data['idList'] = this.list_completed_id
        data['pos'] = 'top'
      }

      // Trigger update
      this.update_card(data)
    },
    get_reschedule_tooltip (days) {
      let new_due = moment(this.card.due).add(days, 'days')
      return new_due.format('dd, DD.MM.')
    },
    update_card (data) {
      // Set status indicator to loading
      this.status = 'loading'

      // Dispatch to store which triggers api
      this.$store.dispatch('update_card', {
        card_id: this.card.id,
        data: data
      }).then(() => {
        this.status = 'ok'
        this.status_msg = ''

        // Hide successful indicator after 2 seconds
        setTimeout(() => {
          this.status = 'hidden'
        }, 2000)
      }).catch(e => {
        // Display error
        this.status = 'error'
        this.status_msg = e.message
      })
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
.reschedule_button {
    display: inline-block;
    padding-right: 6px;
}
.header > a {
    color: rgba(0,0,0,.87);
}
</style>
