<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Sistema 7:3
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/'
  },
  {
    title: 'Ordens',
    icon: 'list_alt',
    link: '/orders'
  },
  {
    title: 'Remessas',
    icon: 'receipt',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Pedidos',
    icon: 'feed',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Espelhos',
    icon: 'import_contacts',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Produtos',
    icon: 'inventory',
    link: '/products'
  },

  {
    title: 'Informativos',
    icon: 'notifications',
    link: 'https://facebook.quasar.dev'
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      linksList,
      leftDrawerOpen: false
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
})
</script>
