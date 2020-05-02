<template>
  <div class="ui labeled button">
    <div v-on:click="reload()" class="ui primary button" v-bind:class="{ 'loading disabled': loading }">
      Reload
    </div>
    <a class="ui basic label">
      Last: {{ last_refreshed }}
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Reload',
  methods: {
    reload () {
      this.$store.dispatch('reload')
    }
  },
  computed: {
    ...mapState({
      last_refreshed: state => {
        if (state.last_refreshed === undefined) {
          return 'Never'
        } else {
          return state.last_refreshed.format('HH:mm')
        }
      },
      loading: state => state.cards_loading
    })
  }
}
</script>
