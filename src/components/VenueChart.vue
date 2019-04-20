<template>
  <div
    ref="chart"
    calss="chart-container"
  />
</template>

<script>
import G2 from '@antv/g2'
import {
  timeFormatter,
  findByTime
} from '../utils/util'
import {
  checkPosition
} from '../utils/position'

const ROOM_ARRAY = ['room-main', 'room-A', 'room-B', 'room-C', 'room-D']

export default {
  props: {
    position: {
      type: String,
      required: true,
      default: 'room-main',
      validator: function (value) {
        return ROOM_ARRAY.indexOf(value) !== -1
      }
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
      width: 600,
      height: 300
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
      this._chart.axis('time', {
        label: {
          formatter: timeFormatter
        }
      })
      this._chart.line().position('time*count').color('type')
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
