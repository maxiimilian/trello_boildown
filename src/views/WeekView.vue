<template>
    <div>
        <button class="ui button left floated" v-on:click="week--">Prev </button>
        <button class="ui button right floated" v-on:click="week++">Next</button>
        <div style="clear: both;"></div>

        <div class="scrolling week">
            <CardListDay class="ui cards scrolling day" v-for="dow in dow_array" v-bind:key="dow" v-bind:dow="dow"/>
        </div>
    </div>
</template>

<script>
import CardListDay from '../components/CardListDay.vue'

export default {
  name: 'WeekView',
  components: {
    CardListDay
  },
  data () {
    return {
      week: 0
    }
  },
  computed: {
    dow_array () {
      let dows = []
      for (let i = 0; i < 7; i++) {
        dows.push(this.week * 7 + i)
      }

      return dows
    }
  }
}
</script>

<style scoped>
.scrolling {
    box-sizing: border-box;
}
.scrolling.week {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
}
.scrolling.day {
    display: inline-grid;
    margin: 0 6px 0 6px;
    width: 290px;
}

</style>
