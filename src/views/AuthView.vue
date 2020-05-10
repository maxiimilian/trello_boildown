<template>
    <div id="trello_auth" class="ui form">
        <ErrorDisplay v-bind:errors="errors" />
        <div class="field">
            <label class="label">
                Trello Token
                <input class="input" type="text" name="trello_auth_token" v-model.lazy="token"/>
            </label>
        </div>
        <div class="field">
            <label class="label">
                Trello Key
                <input class="input" type="text" name="trello_auth_key" v-model.lazy="key"/>
            </label>
        </div>
        <button class="ui primary button" v-on:click="get_my_boards">Connect</button>
    </div>
</template>

<script>
import ErrorDisplay from '../components/ErrorDisplay.vue'

export default {
  name: 'AuthView',
  components: {
    ErrorDisplay
  },
  data () {
    return {
      errors: []
    }
  },
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
      this.$store.dispatch('get_my_boards').then(() => {
        this.errors = []
        this.$router.push('list')
      }).catch(e => {
        this.errors.push(e)
      })
    }
  }
}
</script>

<style>

</style>
