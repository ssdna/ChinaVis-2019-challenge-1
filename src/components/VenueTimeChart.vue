<template>
  <div
    ref="chart"
    class="chart-container"
  />
</template>

<script>
import G2 from '@antv/g2'
// import {
//   timeFormatter,
//   findByTime
// } from '../utils/util'
import {
  POSITIONS,
  checkPosition
} from '../utils/position'

const ROOM_ARRAY = Object.values(POSITIONS)

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
      height: 320,
      padding: { top: 40, right: '20%', bottom: 20, left: 70 }
    })
  },
  methods: {
    getData () {
      let data = []
      // 各位置时长记录迭代器
      let counter = {}
      // 对于每个人
      Object.values(window.data).forEach(person => {
        // 初始化记录器
        ROOM_ARRAY.forEach(room => {
          counter[room] = 0
        })
        // 对于这个人在每个传感器的记录
        person.forEach((v, i, arr) => {
          // 忽略最后一条数据
          if (i === arr.length - 1) {
            return
          }
          // 判断当前传感器的位置
          const room = checkPosition(v)
          counter[room] += arr[i + 1].time - arr[i].time
        })
        // 对于同一个人，插入position的个数条数据
        ROOM_ARRAY.forEach((room, index) => {
          // if (index > 10) {
          //   return
          // }
          data.push({
            id: person[0].id,
            type: room,
            duration: counter[room]
          })
        })
      })
      data.sort((a, b) => {
        const aIndex = ROOM_ARRAY.indexOf(a.type)
        const bIndex = ROOM_ARRAY.indexOf(b.type)
        // room相同，则按duration降序排序
        if (aIndex - bIndex === 0) {
          return b.duration - a.duration
        } else {
          return aIndex - bIndex
        }
      })

      let typeIndex = 0
      let tmp = [{
        index: 0,
        ...data[0]
      }]
      for (let i = 1; i < data.length; i++) {
        if (data[i].type === data[i - 1].type) {
          tmp[i] = {
            index: ++typeIndex,
            ...data[i]
          }
        } else {
          typeIndex = 0
          tmp[i] = {
            index: 0,
            ...data[i]
          }
        }
      }
      return tmp
    },
    renderer () {
      this._data = this.getData()
      console.log(this._data)
      this._chart.source(this._data)
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
                .replace('{value}', item.value)
            }
            return html
          }

          return `
            <div class="g2-tooltip">
              <div class="g2-tooltip-title" style="margin-bottom: 4px;">人员ID: ${data.id}</div>
              <ul class="g2-tooltip-list">${mapItems(items)}</ul>
            </div>
          `
        }
      })
      this._chart.legend({
        position: 'right',
        selectedMode: 'single'
      })
      this._chart.axis('index', false)
      this._chart.axis('duration', {
        title: {
          position: 'end'
        }
      })
      this._chart.scale('duration', {
        alias: '时长(秒)'
      })
      // 初始时只展示 berlin 的数据
      this._chart.filter('type', val => {
        return val === ROOM_ARRAY[0]
      })
      this._chart.line().position('index*duration').color('type')
      this._chart.render()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
