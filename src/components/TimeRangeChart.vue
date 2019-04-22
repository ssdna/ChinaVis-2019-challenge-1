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
        const [ aMin, aMax ] = a.time
        const [ bMin, bMax ] = b.time
        return (bMax - bMin) - (aMax - aMin)
        // const [ aMin, aMax ] = a.time
        // const [ bMin, bMax ] = b.time
        // if (aMin - bMin === 0) {
        //   return aMax - bMax
        // } else {
        //   return aMin - bMin
        // }
      }).map((item, index) => {
        return {
          index,
          ...item
        }
      })
      // .slice(0, 1000)
      return data
    },
    renderer () {
      this._data = this.getData()
      this._chart.source(this._data)
      this._chart.axis('time', {
        position: 'left',
        label: {
          formatter: timeFormatter
        }
      })
      this._chart.scale('time', {
        alias: '时间',
        min: 24000,
        max: 62000
      })
      this._chart.axis('index', false)
      // 翻转坐标轴
      this._chart.coord().transpose()
      this._chart.legend(false)

      this._chart.tooltip({
        useHtml: true,
        shared: true,
        htmlContent: function (title, items) {
          const data = items[0].point._origin

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
                .replace('{value}', `${timeFormatter(data.min)}-${timeFormatter(data.max)}`)
            }
            return html
          }

          return `
            <div class="g2-tooltip">
              <div class="g2-tooltip-title" style="margin-bottom: 4px;">id: ${data.id}</div>
              <ul class="g2-tooltip-list">${mapItems(items)}</ul>
            </div>
          `
        }
      })

      this._chart.on('tooltip:change', ev => {
        // const data = ev.items[0].point._origin
        // console.log(data, ev)
        // const item = ev.items[0] // 获取tooltip要显示的内容
        // item.value = '格式化-' + (item.value * 100).toFixed(2) + '%'
      })
      // this._chart.on('mousemove', (ev) => {
      //   const records = this._chart.getSnapRecords(ev)
      //   if (G2.Util.isArray(records) && records.length) {
      //     const data = records[0]._origin
      //     console.log(data)
      //   }
      // })
      this._chart.interval().position('index*time')
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
