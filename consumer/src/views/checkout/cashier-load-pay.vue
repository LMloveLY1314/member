<template>
  <div class="__pay_form__">
    <van-nav-bar title="支付跳转"/>
    <h3 class="tip">支付跳转中...</h3>
  </div>
</template>

<script>
  import * as API_Trade from '../../api/order';

  export default {
    name: 'cashier-load-pay',

    mounted() {
      /**
       * 挂载组件时从路由参数中获取订单类型，订单号，支付插件id
       * 挂载之后，对这个订单发起支付，后台调起支付宝api，拼接出一个form表单对象给前端，前端来发起支付
       * */
      const { order_sn} = this.$route.query
      API_Trade.initiatePay( order_sn, {
        client_type: 'WAP',
        pay_mode: 'normal',
      }).then(response => {
        let $formItems = ''
        /** 获取响应的form对象的每一项，拼接成一个form表单，向支付宝发起请求*/
        response.form_items.forEach(item => {
          $formItems += `<input name="${item.item_name}" type="hidden" value='${item.item_value}' />`
        })
        let $form = `<form action="${response.gateway_url}" method="post">${$formItems}</form>`
        document.getElementsByClassName('__pay_form__')[0].innerHTML = $form
        document.forms[0].submit()
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .tip {
    text-align: center;
    font-size: 20px;
    line-height: 200px;
    font-weight: 600;
  }
</style>
