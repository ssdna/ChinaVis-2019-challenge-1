<template>
  <div id="app">
    <div
      id="app3D-container"
      ref="app3D"
    />

    <venue-chart
      class="chart"
      position="room-main"
    />
    <!-- <venue-chart position="room-A" />
    <venue-chart position="room-B" />
    <venue-chart position="room-C" />
    <venue-chart position="room-D" /> -->

    <div class="status-bar">
      <span id="timer">{{ timeString }}</span>
      <span id="content">{{ lastPointsNumString }}</span>
    </div>
    <div
      v-if="isLoading"
      id="loading"
    >
      LOADING
    </div>
  </div>
</template>

<script>
import App3D from '../js/App3D'
import VenueChart from './VenueChart.vue'
import { timeFormatter } from '../utils/util'

export default {
  components: {
    'venue-chart': VenueChart
  },
  data () {
    return {
    }
  },
  computed: {
    isLoading () {
      return this.$store.getters.getState('loading')
    },
    timeString () {
      const timestamp = this.$store.getters.getState('timestamp')
      return timeFormatter(timestamp)
    },
    lastPointsNumString () {
      const lastPointsNum = this.$store.getters.getState('lastPointsNum')
      const currentLog = this.$store.getters.getState('currentLog')
      return `
        当前总人数：${lastPointsNum}
        当前记录：${JSON.stringify(currentLog)}
      `.trim()
    }
  },
  watch: {
    isLoading (before, after) {
      this.app3D.animate()
    }
  },
  created () {
    window.a = this
    this.app3D = new App3D(true)
  },
  mounted () {
    this.app3D.mount(this.$refs.app3D)
  }
}
</script>

<style lang="less" scoped>
#app {
  position: relative;
  width: 1920px;
  height: 940px;
}
#app3D-container {
  position: absolute;
  color: blue;
  font-size: 32px;
  width: 1000px;
  height: 600px;
}
.chart {
  position: absolute;
  top: 600px;
}
.status-bar {
  position: absolute;
  bottom: 0;
  z-index: 100;
  #timer {
    display: inline-block;
    width: 200px;
  }
  #content {
    display: inline-block;
    width: 800px;
    color: green;
  }
}
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
.label{
  color: #FFF;
  font-family: sans-serif;
  padding: 2px;
  background: rgba( 0, 0, 0, .6 );
  transition: transform 100ms;
}
</style>
