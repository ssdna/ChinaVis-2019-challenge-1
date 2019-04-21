<template>
  <div
    ref="chart"
    calss="chart-container"
  />
</template>

<script>
import G2 from '@antv/g2'
import {
  timeFormatter
} from '../utils/util'

export default {
  data () {
    return {
    }
  },
  computed: {
    isLoading () {
      return this.$store.getters.getState('loading')
    }
  },
  watch: {
    isLoading (before, after) {
      this.renderer()
    }
  },
  created () {
  },
  mounted () {
    this._chart = new G2.Chart({
      container: this.$refs.chart,
      width: 800,
      height: 600,
      padding: { top: 20, right: '20%', bottom: 20, left: 70 }
    })
  },
  methods: {
    getData () {
      let data = []
      data = Object.values(window.data).map(item => {
        const min = item[0].time
        const max = item[item.length - 1].time
        return {
          id: item[0].id,
          min,
          max,
          time: [ min, max ]
        }
      }).sort((a, b) => {
        // const [ aMin, aMax ] = a.time
        // const [ bMin, bMax ] = b.time
        // return (bMax - bMin) - (aMax - aMin)
        const [ aMin, aMax ] = a.time
        const [ bMin, bMax ] = b.time
        if (aMin - bMin === 0) {
          return aMax - bMax
        } else {
          return aMin - bMin
        }
      }).map(item => {
        return item
      })
      // .slice(0, 1000)
      return data
    },
    renderer () {
      this._data = this.getData()
      this._chart.source(this._data)
      this._chart.axis('min', {
        label: {
          formatter: timeFormatter
        }
      })
      // this._chart.axis('count', {
      //   title: '人数'
      // })
      // this._chart.scale('count', {
      //   alias: '人数(个)'
      // })
      this._chart.area().position('id*time')
      // this._chart.line().position('id*min')
      this._chart.render()
    }
  }
}
</script>

<style lang="less" scoped>
</style>

<style>
.g2-tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  color: rgb(87, 87, 87);
  font-size: 12px;
  line-height: 20px;
  padding: 10px 10px 6px 10px;
  box-shadow: 0px 0px 10px #aeaeae;
  pointer-events: none;
}

.g2-tooltip-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.g2-tooltip-value {
  margin-left: 30px;
  display: inline;
  float: right;
}
</style>
