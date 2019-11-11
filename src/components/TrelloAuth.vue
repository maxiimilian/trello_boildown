<template>
    <div id="trello_auth">
        <div v-if="!connected">
            <label class="label">
                Trello Token
                <input class="input" type="text" name="trello_auth_token" v-model.lazy="token"/>
            </label>
            <label class="label">
                Trello Key
                <input class="input" type="text" name="trello_auth_key" v-model.lazy="key"/>
            </label>
            <input class="button is-primary" type="submit" value="Connect" v-on:click="get_my_boards"/>
        </div>
        <div v-if="connected">
            <p>Connected to Trello!</p>
            <input class="button" type="submit" value="Disconnect" v-on:click="disconnect"/>
        </div>
    </div>
</template>

<script>
export default {
  name: 'TrelloAuth',
  computed: {
    connected () {
      return this.$store.state.trello_auth.connected
    },
    token: {
      get () {
        return this.$store.state.trello_auth.token
      },
      set (value) {
        this.$store.commit('set_auth_token', value)
      }
    },
    key: {
      get () {
        return this.$store.state.trello_auth.key
      },
      set (value) {
        this.$store.commit('set_auth_key', value)
      }
    }
  },
  methods: {
    get_my_boards () {
      this.$store.dispatch('get_my_boards')
    },
    disconnect () {
      this.$store.commit('set_connection_state', false)
    }
  }
}
</script>

<style scoped>

</style>
