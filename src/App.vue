<template>
  <div id="app" class="ui container">
    <!-- Header -->
    <div id="header" class="ui stackable grid">
      <div class="five wide column">
        <h1 class="ui header">Trello Boildown</h1>
      </div>
      <div class="eleven wide column" v-if="connected">
        <div class="ui secondary menu">
          <router-link to="/list" class="item">List</router-link>
          <router-link to="/week" class="item">Week</router-link>

          <div class="right menu">
            <Reload></Reload>
            <div class="ui icon button" v-on:click="toggle_settings()" v-bind:class="settings_open ? 'active': ''">
              <i class="cog icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui divider"></div>

    <!-- Settings -->
    <div id="settings" v-if="settings_open">
      <button class="ui negative button" v-on:click="disconnect">Disconnect</button>
      <BoardMultiSelect v-if="connected"/>
      <div class="ui clearing divider"></div>
    </div>

    <!-- Views -->
    <router-view></router-view>

  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

import BoardMultiSelect from './components/BoardMultiSelect.vue'
import Reload from './components/Reload.vue'

export default {
  name: 'app',
  components: {
    BoardMultiSelect,
    Reload
  },
  created () {
    // Reload after timeout when window gets focus
    window.addEventListener('focus', this.reload_on_focus)
  },
  destroyed () {
    // Remove focus reload event listeners
    window.removeEventListener('focus', this.reload_on_focus)
  },
  computed: {
    ...mapState({
      'connected': state => state.trello_auth.connected,
      'last_refreshed': state => state.last_refreshed
    })
  },
  methods: {
    disconnect () {
      this.$store.commit('set_connection_state', false)
      this.$router.push('auth')
    },
    toggle_settings () {
      this.settings_open = !this.settings_open
    },
    reload_on_focus () {
      /* Refresh cards on focus if reload was more than 15 minutes ago */
      if (this.last_refreshed !== undefined) {
        let diff = moment().diff(this.last_refreshed, 'minutes', true)
        if (diff > 15) {
          this.$store.dispatch('reload')
        }
      }
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
