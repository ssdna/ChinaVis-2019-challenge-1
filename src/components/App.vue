<template>
  <div id="app">
    <div
      v-if="isLoading"
      id="loading"
    >
      LOADING
    </div>
    <div id="app3D-container">
      <span id="timer" />
      <span id="content" />
    </div>
  </div>
</template>

<script>
import App3D from '../js/App3D'

export default {
  data () {
    return {
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.loading
    }
  },
  watch: {
    isLoading (before, after) {
      this.app3D.animate()
      console.log(before, after)
    }
  },
  created () {
    this.app3D = new App3D(true)
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
#loading {
  position: absolute;
  width: 300px;
  height: 100px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 36px;
  color: greenyellow;
}
#app3D-container {
  position: absolute;
  color: blue;
  font-size: 32px;
}
#timer {
  display: inline-block;
  width: 200px;
}
#content {
  display: inline-block;
  width: 400px;
  color: green;
}
.label{
  color: #FFF;
  font-family: sans-serif;
  padding: 2px;
  background: rgba( 0, 0, 0, .6 );
  transition: transform 100ms;
}
</style>
