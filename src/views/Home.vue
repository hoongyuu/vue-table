<template>
  <div class="pages-home">
    <components-table class="pages-home__table" :columns="columns" :data="data">
      <template #customAge>
        <span>Age</span>
      </template>
      <template #firstName="{ title }">
        <a href="#">{{ title }}</a>
      </template>
    </components-table>
  </div>
</template>

<script>
import ComponentsTable from '@/components/Table.vue'

const columns = [
  {
    dataIndex: 'index',
    key: 'index',
    title: '#',
    width: 600,
    child: [
      {
        dataIndex: 'first',
        key: 'firstName',
        title: 'First Name',
        scopedSlots: { customRender: 'firstName' }
      },
      {
        dataIndex: 'last',
        key: 'last',
        title: 'Last Name',
        child: [
          {
            dataIndex: 'child',
            key: 'child',
            title: 'child',
            child: [
              {
                dataIndex: 'maxchild',
                key: 'maxchild',
                title: 'maxchild'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    slots: { title: 'customAge' },
    dataIndex: 'age',
    key: 'age',
    align: 'center'
  },
  {
    title: 'Other',
    dataIndex: 'other',
    key: 'other',
    width: 600,
    child: [
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        align: 'right'
      },
      {
        title: 'Action',
        key: 'action'
      }
    ]
  }
]

const data = [
  {
    firstName: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    firstName: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    firstName: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

export default {
  name: 'Home',
  components: { ComponentsTable },
  data () {
    return {
      columns,
      data
    }
  }
}
</script>

<style lang="sass" scoped>
// .pages-home__table
//   display: flex
//   flex-direction: column
//   justify-content: center
</style>
