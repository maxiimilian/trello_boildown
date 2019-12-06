<template>
  <div id="app" class="ui container">
    <div id="header">
        <h1 class="ui header left floated">Trello Boildown</h1>
        <button class="ui negative button right floated" v-on:click="disconnect">Disconnect</button>
    </div>
    <router-link to="/list">List</router-link>
    <router-link to="/week">Week</router-link>
    <div class="ui clearing divider"></div>

    <div>
        <BoardMultiSelect v-if="connected"/>
    </div>
    <div class="ui clearing divider"></div>

    <router-view></router-view>

  </div>
</template>

<script>
import BoardMultiSelect from './components/BoardMultiSelect.vue'

export default {
  name: 'app',
  components: {
    BoardMultiSelect
  },
  computed: {
    connected () {
      return this.$store.state.trello_auth.connected
    }
  },
  methods: {
    disconnect () {
      this.$store.commit('set_connection_state', false)
    }
  }
}
</script>

<style>
#header {
    padding-top: 14px;
}
</style>
