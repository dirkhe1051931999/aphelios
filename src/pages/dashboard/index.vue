<template>
  <div>123</div>
</template>

<script lang="ts">
import { UserModule } from 'src/store/modules/user';
import { Vue, Component } from 'vue-facing-decorator';

@Component({
  name: 'DashboardComponent',
  components: {},
})
export default class DashboardComponent extends Vue {
  async created() {}
  mounted() {}
}
</script>
<style lang="scss">
.body--dark {
}
.body--light {
}
</style>
