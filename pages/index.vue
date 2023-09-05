<template>
  <div>
    <Home v-if="activeTab === 'home'" />
    <Directory v-if="activeTab === 'directory'" />
    <Explore v-if="activeTab === 'explore'" />
    <Profile v-if="activeTab === 'profile'" />
  </div>
</template>

<script>
import Directory from '~/components/Directory.vue';
import Explore from '~/components/Explore.vue';
import Home from '~/components/Home.vue';
import Profile from '~/components/Profile.vue';

export default {
  components: {
    Directory,
    Explore,
    Home,
    Profile,
  },
  async asyncData({ store }) {
    await store.dispatch('modules/home/fetchPostChannels');
    await store.dispatch('modules/home/fetchPostList');
  },
  computed: {
    activeTab() {
      return this.$store.getters['modules/app/activeTab'];
    },
  },
  layout: 'index',
};
</script>

<style scoped lang="scss"></style>
