<template>
    <div id="board_multi_select">
        <select multiple v-model="boards_selected">
            <option v-for="b in boards" v-bind:key="b.id" v-bind:value="b.id">{{ b.name }}</option>
        </select>
        <input type="submit" v-on:click="reload" value="Reload" /><br />
        <span>Last refresh: {{ last_refresh }}</span>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'BoardMultiSelect',
  data: function () {
    return {}
  },
  computed: {
    boards () {
      return this.$store.state.boards
    },
    boards_selected: {
      get () {
        return this.$store.state.boards_selected
      },
      set (value) {
        this.$store.commit('set_boards_selected', value)
      }
    },
    last_refresh () {
      let last_refresh = this.$store.state.last_refresh
      if (last_refresh === null) {
        return 'Never'
      } else {
        return moment(last_refresh).format('HH:mm')
      }
    }
  },
  methods: {
    reload () {
      console.log('Reload triggered')
      this.$store.dispatch('get_cards')
    }
  }
}
</script>

<style scoped>

</style>
