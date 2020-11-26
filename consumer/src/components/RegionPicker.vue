<template>
  <div></div>
</template>

<script>
  export default {
    name: 'EnRegionPicker',
    props: {
      default: {
        default: null
      },
      api: {
        type: String,
        default: `http://localhost:7003/regions/@id/children`
      },
      show: {
        default: false
      }
    },
    watch: {
      show(newVal) {
        newVal && $(this.$el).click()
      }
    },
    mounted() {
      this.initAddressSelect()
    },
    methods: {
       changeAddressSelect(){
           //显示两级菜单
         this.$nextTick(() => {
           $(this.$el).addressSelect({
             api: this.api,
             callback: this.callback,
             deData: this.default,
             closed: this.closed,
             max:2
           })
         })
       } ,
      callback(object) {
        this.$emit('changed', object)
      },
      closed() {
        this.$emit('closed')
      },
      initAddressSelect() {
        this.$nextTick(() => {
          $(this.$el).addressSelect({
            api: this.api,
            callback: this.callback,
            deData: this.default,
            closed: this.closed
          })
        })
      }
    },
    destroyed() {
      $('#selectAddressApp').remove()
      $('#addressSelectorStyle').remove()
    }
  }
</script>
