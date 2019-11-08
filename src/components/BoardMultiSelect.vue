<template>
    <div class="board_multi_select">
        <select multiple>
            <option v-for="b in boards" v-bind:key="b.name" v-bind:selected="b.selected">{{ b.name }}</option>
        </select>
    </div>
</template>

<script>
export default {
  name: 'BoardMultiSelect',
  data: function () {
    return {}
  },
  computed: {
    boards: function () {
      return this.$store.state.boards
    }
  }
}
</script>

<style scoped>

</style>
