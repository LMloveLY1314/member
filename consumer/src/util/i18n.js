export function generateTitle(title) {
  return this.$t('route.' + title) // $t :this method from vue-i18n ,inject in @/lang/adminIndex.js
}
//前端国际化
