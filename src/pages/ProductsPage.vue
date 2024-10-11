<script lang="js">
import {defineComponent} from 'vue'
import { product } from '../services/products'

export default defineComponent({
  name: "ProductsPage",
  data: () =>{
    return {
      products: [],
      isOpen: false,
      form: {
        name: '',
        price: 0,
        voltage: '',
        cod: '',
        image: '',
      },
      file: '',
    }
  },
  methods: {
    async getProducts() {
      this.products = await product.getProducts();
    }
  },
  mounted() {
    this.getProducts();
  }
})
</script>

<template>
    <q-btn
      @click="isOpen = !isOpen"
    >
      ADICIONAR
    </q-btn>
    <q-table :rows="products">
    </q-table>


  <q-dialog v-model="isOpen">
    <q-card>
      <q-card-section class="row items-center q-pb-none text-h6">
        Cadastrar produto
      </q-card-section>
      <q-form>
        <q-input
          outlined
          label="Nome"
          v-model="form.login"
          type="text"
        />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
