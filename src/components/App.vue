<template>
  <div id="app">
    <div
      id="app3D-container"
      ref="app3D"
    />

    <venue-person-chart class="chart venue-person-chart" />
    <venue-time-chart class="chart venue-time-chart" />
    <time-range-chart class="chart time-range-chart" />

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
import VenuePersonChart from './VenuePersonChart.vue'
import VenueTimeChart from './VenueTimeChart.vue'
import TimeRangeChart from './TimeRangeChart.vue'
import { timeFormatter } from '../utils/util'

export default {
  components: {
    'venue-person-chart': VenuePersonChart,
    'venue-time-chart': VenueTimeChart,
    'time-range-chart': TimeRangeChart
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
  height: 580px;
}
.chart {
  position: absolute;
}
.venue-person-chart {
  top: 580px;
}
.venue-time-chart {
  top: 580px;
  left: 800px;
}
.time-range-chart {
  top: 0px;
  left: 1000px
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

<style>
@import '../css/g2_custom.css';
</style>
