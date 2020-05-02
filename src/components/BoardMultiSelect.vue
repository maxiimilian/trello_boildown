<template>
    <div id="board_multi_select" class="ui form">
        <div class="field">
            <label class="label">
                Select boards to load
                <select class="" multiple v-model="boards_selected">
                    <option v-for="b in boards" v-bind:key="b.id" v-bind:value="b.id">{{ b.name }}</option>
                </select>
            </label>
        </div>
        <button class="ui primary button" :class="loading ? 'loading disabled': ''" v-on:click="reload" >Reload</button>
        <span>Last refresh: {{ last_refresh }}</span>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'BoardMultiSelect',
  data: function () {
    return {
      'loading': false,
      'last_refresh': 'Never'
    }
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
    }
  },
  methods: {
    reload () {
      this.loading = true
      this.$store.dispatch('reload').then(() => {
        this.loading = false
        this.last_refresh = moment().format('HH:mm')
      })
    }
  }
}
</script>
