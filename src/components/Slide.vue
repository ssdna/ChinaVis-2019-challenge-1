<template>
  <div class="slide-container">
    <div ref="slide" />
  </div>
</template>

<script>
// import G2 from '@antv/g2'
import Slider from '@antv/g2-plugin-slider'
import DataSet from '@antv/data-set'
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
      this._ds = this.getDataSet()
      this.renderer()
    }
  },
  created () {
    window.a = this
  },
  mounted () {
  },
  methods: {
    getDataSet () {
      const ds = new DataSet({
        state: {
          start: window.params.min,
          end: window.params.max
        }
      })
      // !!! 通过 ds 创建 DataView
      const dv = ds.createView()
      dv.source(window.originData)
        .transform({ // !!! 根据状态量设置数据过滤规则，
          type: 'filter',
          callback: obj => {
            return obj.time <= ds.state.end && obj.time >= ds.state.start
          }
        })
      return ds
    },
    renderer () {
      this._slider = new Slider({
        container: this.$refs.slide,
        padding: [ 20, 100, 60 ],
        // start: ds.state.from,
        // end: ds.state.to,
        data: window.originData.slice(0, 1000),
        xAxis: 'time',
        yAxis: 'id',
        scales: {
          time: {
            formatter: timeFormatter
          }
        },
        backgroundChart: {
          type: 'interval',
          color: 'rgba(0, 0, 0, 1)'
        },
        onChange: ({ startText, endText }) => {
        // !!! 更新状态量
        // ds.setState('from', startText);
        // ds.setState('to', endText);
        }
      })
      this._slider.render()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
