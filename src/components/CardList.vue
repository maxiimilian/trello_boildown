<template>
    <div>
            <h3 class="collapse ui header" v-on:click="toggle_collapse">
                <i class="angle icon" v-bind:class="collapsed ? 'right' : 'down'"></i>
                <div class="ui content">
                {{ header }} ({{ cards.length }})
                </div>
            </h3>
        <div class="ui three doubling stackable cards" v-if="!collapsed">
            <Card v-for="c in cards" v-bind:key="c.id" v-bind:card="c" v-bind:board="boards[c.board_id]"/>
            <br />
        </div>
        <br />
    </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'CardList',
  components: {
    Card
  },
  props: {
    cards: Array,
    header: String,
    initially_collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    boards () {
      return this.$store.state.boards
    }
  },
  data () {
    return {
      collapsed: this.initially_collapsed
    }
  },
  methods: {
    toggle_collapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style scoped>
.collapse {
    cursor: pointer;
    width: 100%;
}
</style>
