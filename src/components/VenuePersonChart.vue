<template>
  <div
    ref="chart"
    class="chart-container"
  />
</template>

<script>
import G2 from '@antv/g2'
import {
  timeFormatter,
  findByTime
} from '../utils/util'
import {
  POSITIONS,
  checkPosition
} from '../utils/position'

const ROOM_ARRAY = Object.values(POSITIONS)

export default {
  props: {
    position: {
      type: String,
      default: 'room-main'
      // required: false,
      // validator: function (value) {
      //   return ROOM_ARRAY.indexOf(value) !== -1
      // }
    }
  },
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
      height: 320,
      padding: { top: 40, right: '20%', bottom: 20, left: 70 }
    })
  },
  methods: {
    getData () {
      const { min, max } = window.params

      let data = []
      let counter = {}

      for (let time = min; time < max; time += 30) {
        const result = findByTime(window.data, time)

        ROOM_ARRAY.forEach(item => {
          counter[item] = 0
        })

        for (let i = 0; i < result.length; i++) {
          const item = result[i]
          const name = checkPosition(item)
          if (name) {
            counter[name]++
          }
        }

        ROOM_ARRAY.forEach(item => {
          data.push({
            time,
            count: counter[item],
            type: item
          })
        })
      }
      return data
    },
    renderer () {
      this._data = this.getData()
      this._chart.source(this._data)
      this._chart.tooltip({
        useHtml: true,
        shared: true,
        htmlContent: function (title, items) {
          function mapItems (items) {
            const itemTpl = `
              <li data-index={index}>
                <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
                {name}<span class="g2-tooltip-value">{value}</span>
              </li>
            `
            let html = ''
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              html += itemTpl.replace('{index}', i)
                .replace('{color}', item.color)
                .replace('{name}', item.name)
                .replace('{value}', item.value)
            }
            return html
          }

          return `
            <div class="g2-tooltip">
              <div class="g2-tooltip-title" style="margin-bottom: 4px;">${timeFormatter(title)}</div>
              <ul class="g2-tooltip-list">${mapItems(items)}</ul>
            </div>
          `
        }
      })
      this._chart.legend({
        position: 'right',
        selectedMode: 'single'
      })
      this._chart.axis('time', {
        label: {
          formatter: timeFormatter
        }
      })
      this._chart.axis('count', {
        title: {
          position: 'end'
        }
      })
      this._chart.scale('count', {
        alias: '人数(个)'
      })
      // 初始时只展示 berlin 的数据
      this._chart.filter('type', val => {
        return val === ROOM_ARRAY[0]
      })
      this._chart.line().position('time*count').color('type')
      this._chart.render()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
