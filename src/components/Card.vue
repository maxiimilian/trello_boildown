<template>
    <div class="ui card">
        <div class="content">
            <div class="right floated meta"><StatusIndicator :status="status" :msg="status_msg"/></div>
            <div class="header"><a :href="card.shortUrl" target="_blank">{{ card.name }}</a></div>
            <div class="meta"><a :href="board.shortUrl" target="_blank">{{ board.name }}</a></div>
        </div>
        <div class="extra content">
            <div class="left floated">
                <div v-if="card.due !== null" class="ui label due" v-bind:class="due_color" v-bind:data-tooltip="due.tooltip" data-position="top left" data-inverted="">{{ due.short }}</div>
            </div>
            <div class="right floated">
                <a v-on:click="reschedule(1)" class="reschedule_button">+1d</a>
                <a v-on:click="reschedule(2)" class="reschedule_button">+2d</a>
                <a v-on:click="reschedule(7)" class="reschedule_button">+1w</a>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import StatusIndicator from './StatusIndicator'

export default {
  name: 'Card',
  props: ['card', 'board'],
  components: {
    StatusIndicator
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
  },
  data () {
    return {
      status: 'hidden',
      status_msg: ''
    }
  },
  methods: {
    reschedule (days) {
      this.status = 'loading'

      let new_due = moment(this.card.due).add(days, 'days')

      this.$store.dispatch('update_card', {
        card_id: this.card.id,
        data: {
          due: new_due.toISOString()
        }
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
