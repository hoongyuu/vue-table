<template>
  <div :class="['components-table', {'components-table--scroll-x': scroll.x}, {'components-table--scroll-y': scroll.y}]">
    <table class="components-table__table" :style="tableWidth">
      <thead class="components-table__table-header">
        <tr v-for="(column, i) in result" :key="`column${i}`">
          <th
            v-for="item in column"
            :key="item.title"
            :rowspan="item.rowspan"
            :colspan="item.colspan"
            :style="getColumnStyle(item)"
          >
            <template v-if="item.slots">
              <slot :name="item.slots.title"></slot>
            </template>
            <template v-else>
              {{ item.title }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody class="components-table__table-body">
        <tr v-for="(row, rowIndex) in data" :key="row.key">
          <td v-for="(item, key, index) in row" :key="key" :style="getScopedStyles(key)">
            <template v-if="checkScopedSlots(key)">
              <slot :name="key" :title="item" :row-data="row" :col-key="key" :col-index="index" :row-index="rowIndex"></slot>
            </template>
            <template v-else>
              {{ item }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="components-table__pagination-wrap">
      <div class="components-table__pagination">
        <button type="button"
          class="components-table__pagination-item"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button type="button"
          class="components-table__pagination-item  components-table__pagination-item--active"
        >
          1
        </button>
        <button type="button"
          class="components-table__pagination-item components-table__pagination-item--disabled"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  forEach, pathOr, prop, omit, max, map, length, is, find
} from 'ramda'
import isObj from '@/utils/isObj.js'

export default {
  name: 'components-table',
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    scroll: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      result: [],
      scopedSlots: [],
      scopedStyles: {},
      tempDeepth: 0,
      maxDeepth: 0
    }
  },
  async mounted () {
    this.maxDeepth = this.getColumnMaxDeepth(this.columns, 0)
    this.getFormattedColumnsLevel(this.formattedColumns)
  },
  computed: {
    formattedColumns () {
      return this.getFormattedColumns(this.columns)
    },
    tableWidth () {
      if (is(Number, this.scroll.x) && this.scroll.x !== 0) {
        return { width: `${this.scroll.x}px` }
      }
      if (is(String, this.scroll.x)) {
        return { width: this.scroll.x }
      }
      return { width: '100%' }
    }
  },
  methods: {
    pathOr,
    getFormattedColumns (column, deepth = 0) {
      return map((col) => {
        const hasChild = !!col.child
        if (col.scopedSlots) {
          this.scopedSlots.push(col.scopedSlots)
        }
        if (col.width || col.minWidth || col.align) {
          this.$set(this.scopedStyles, col.key, omit(['child'], col))
        }
        return hasChild ? {
          ...col,
          colspan: length(col.child),
          rowspan: 1,
          child: this.getFormattedColumns(col.child, deepth + 1)
        } : {
          ...col,
          colspan: 1,
          rowspan: this.maxDeepth - deepth
        }
      }, column)
    },
    getFormattedColumnsLevel (column, level = 0) {
      forEach((col) => {
        if (!prop(level, this.result)) {
          this.$set(this.result, level, [])
        }
        this.result[level] = [
          ...this.result[level],
          omit(['child'], col)
        ]
        if (col.child) {
          this.getFormattedColumnsLevel(prop('child', col), level + 1)
        }
      }, column)
    },
    getColumnMaxDeepth (column, deepth = 0) {
      this.tempDeepth = 0
      if (isObj(column) && !column.child) {
        return 0
      }
      return this.loopColumnDeepth(column, deepth)
    },
    loopColumnDeepth (column, deepth) {
      const tempAry = isObj(column) ? column.child : column
      forEach((col) => {
        if (!col.child) {
          this.tempDeepth = max(deepth, this.tempDeepth)
          return
        }
        this.loopColumnDeepth(col.child, deepth + 1)
      }, tempAry)
      return this.tempDeepth + 1
    },
    getScopedStyles (key) {
      if (!this.scopedStyles[key]) {
        return
      }
      return this.getColumnStyle(this.scopedStyles[key])
    },
    getColumnStyle (column) {
      return {
        ...(column.width ? { width: `${column.width}px` } : {}),
        ...(column.minWidth ? { 'min-width': `${column.minWidth}px` } : {}),
        ...(column.align ? { textAlign: column.align } : {})
      }
    },
    checkScopedSlots (name) {
      return find((s) => s.customRender === name, this.scopedSlots)
    }
  }
}
</script>

<style lang="sass" scoped>
$active: rgb(64, 169, 255)
$disabled: rgb(217, 217, 217)
$border-color:  #ddd

button
  cursor: pointer
  outline: none

.components-table
  display: flex
  flex-direction: column
  th,td
    padding: 16px

  &--scroll-x
    overflow-x: auto
    overflow-y: hidden
  &--scroll-y
    overflow-x: hidden
    overflow-y: auto

  &__table-header
    tr
      border-bottom: 1px solid $border-color
    th
      border: none
      background-color: #fafafa

.components-table__pagination
  &-item
    width: 30px
    height: 30px
    background-color: #fff
    border: 1px solid $border-color
    &--active
      border-color: $active
      color: $active
    &--disabled
      border-color: $disabled
      color: $disabled
    & + &
      margin-left: 5px
</style>
