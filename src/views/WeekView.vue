<template>
    <div class="scrolling week">
        <CardListDay class="ui cards scrolling day" v-for="i in 7" v-bind:key="i" v-bind:dow="i-1"/>
    </div>
</template>

<script>
import CardListDay from '../components/CardListDay.vue'

export default {
  name: 'WeekView',
  components: {
    CardListDay
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
