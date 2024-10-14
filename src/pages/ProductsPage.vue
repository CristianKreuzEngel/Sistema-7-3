<template>
  <div>
    <q-table
      :rows="products"
      :columns="columns"
      row-key="cod"
      flat
      bordered
      :loading="loading"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            icon="edit"
            @click="editProduct(props.row)"
            color="blue"
          />
          <q-btn
            flat
            dense
            icon="delete"
            @click="confirmDelete(props.row)"
            color="red"
          />
        </q-td>
      </template>
    </q-table>

    <q-btn @click="openModal" label="ADICIONAR" color="primary" />

    <!-- Modal para adicionar/editar produto -->
    <q-dialog v-model="isOpen">
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ isEdit ? "Editar" : "Cadastrar" }} Produto
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitForm">
            <q-input
              outlined
              label="Nome"
              v-model="form.name"
              type="text"
              required
            />
            <q-input
              outlined
              label="Preço"
              v-model="form.price"
              type="number"
              required
            />
            <q-input
              outlined
              label="Voltagem"
              v-model="form.voltage"
              type="text"
              required
            />
            <q-input
              outlined
              label="Código"
              v-model="form.cod"
              type="text"
              required
            />
            <q-input
              outlined
              label="Imagem"
              v-model="form.image"
              type="file"
              @change="handleFileUpload"
            />
            <q-btn type="submit" label="Salvar" color="primary" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Confirmação de exclusão -->
    <q-dialog v-model="confirmDeleteDialog">
      <q-card>
        <q-card-section>
          Tem certeza que deseja excluir o produto?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="red" @click="deleteProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { product } from "../services/products";

export default defineComponent({
  name: "ProductsPage",
  data: () => ({
    products: [],
    isOpen: false,
    isEdit: false,
    loading: true,
    confirmDeleteDialog: false,
    productToDelete: null,
    form: {
      name: "",
      price: 0,
      voltage: "",
      cod: "",
      image: "",
    },
    file: null,
    columns: [
      { name: "name", label: "Nome", field: "name", sortable: true },
      { name: "price", label: "Preço", field: "price", sortable: true },
      { name: "voltage", label: "Voltagem", field: "voltage" },
      { name: "cod", label: "Código", field: "cod" },
      { name: "actions", label: "Ações", field: "actions", sortable: false },
    ],
  }),
  methods: {
    async getProducts() {
      this.loading = true;
      this.products = await product.getProducts();
      this.loading = false;
    },
    openModal() {
      this.isEdit = false;
      this.isOpen = true;
      this.resetForm();
    },
    editProduct(product) {
      this.isEdit = true;
      this.isOpen = true;
      this.form = { ...product };
    },
    async submitForm() {
      if (this.isEdit) {
        // Chamada API para editar o produto
        await product.updateProduct(this.form);
      } else {
        // Chamada API para adicionar o produto
        await product.addProduct(this.form);
      }
      this.getProducts();
      this.isOpen = false;
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.confirmDeleteDialog = true;
    },
    async deleteProduct() {
      await product.deleteProduct(this.productToDelete.cod);
      this.getProducts();
      this.confirmDeleteDialog = false;
    },
    resetForm() {
      this.form = {
        name: "",
        price: 0,
        voltage: "",
        cod: "",
        image: "",
      };
      this.file = null;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
      }
    },
  },
  mounted() {
    this.getProducts();
  },
});
</script>

<style scoped>
</style>
