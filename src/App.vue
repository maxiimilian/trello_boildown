<template>
  <div id="app" class="ui container">
    <div id="header" class="ui stackable grid">
        <div class="five wide column">
            <h1 class="ui header">Trello Boildown</h1>
        </div>
        <div class="eleven wide column" v-if="connected">
            <div class="ui secondary menu">
                <router-link to="/list" class="item">List</router-link>
                <router-link to="/week" class="item">Week</router-link>

                <div class="right menu">
                    <button class="ui icon button" v-on:click="toggle_settings()" v-bind:class="settings_open ? 'active': ''"><i class="cog icon"></i></button>
                    <button class="ui negative button" v-on:click="disconnect">Disconnect</button>

                </div>
            </div>
        </div>
    </div>
    <div class="ui divider"></div>

    <div id="settings" v-if="settings_open">
        <button class="ui right floated icon mini button" v-on:click="toggle_settings()"><i class="close icon" ></i></button>

        <BoardMultiSelect v-if="connected"/>
        <div class="ui clearing divider"></div>
    </div>

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
      this.$router.push('auth')
    },
    toggle_settings () {
      this.settings_open = !this.settings_open
    }
  },
  data () {
    return {
      settings_open: false
    }
  }
}
</script>

<style>
#header {
    padding-top: 14px;
}
</style>
