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
      <template v-slot:body-cell-isActive="props">
        <q-td :props="props">
          {{ props.row.isActive ? "Ativo" : "Inativo" }}
        </q-td>
      </template>
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

    <q-btn @click="openModal" class="q-mt-md"  label="ADICIONAR" color="primary" />

    <q-dialog v-model="isOpen">
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ isEdit ? "Editar" : "Cadastrar" }} Produto
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitForm" class="q-my-md">
            <q-input
              class="q-mt-md"
              outlined
              label="Nome"
              v-model="form.name"
              type="text"
              required
            />
            <q-input
              class="q-mt-md"
              outlined
              label="Preço"
              v-model="form.price"
              type="number"
              required
            />
            <q-select
              class="q-mt-md"
              outlined
              :options="voltageOptions"
              option-value="value"
              option-label="label"
              label="Voltagem"
              v-model="form.voltage"
              type="text"
              required
            />
            <q-input
              class="q-mt-md"
              outlined
              label="Código"
              v-model="form.cod"
              type="text"
              required
            />
            <div>
              <p>Imagem</p>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                @change="handleFileUpload"
              />
            </div>

            <q-btn type="submit" label="Salvar" color="primary" class="q-mt-md" />

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

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
    voltageOptions: [
      { label: '110V', value: '110' },
      { label: '220V', value: '220' }
    ],
    columns: [
      { name: "name", label: "Nome", field: "name", sortable: true },
      { name: "price", label: "Preço", field: "price", sortable: true },
      { name: "voltage", label: "Voltagem", field: "voltage" },
      { name: "cod", label: "Código", field: "cod" },
      { name: "isActive", label: "Status", field: "isActive" },
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
      const formdata = new FormData()
      if (this.isEdit) {
        await product.updateProduct(this.form);
      } else {
        formdata.append("name", this.form.name);
        formdata.append("price", this.form.price);
        formdata.append("voltage", this.form.voltage.value);
        formdata.append("cod", this.form.cod);
        formdata.append("file", this.file);
        await product.createProduct(formdata);
      }
      this.getProducts();
      this.isOpen = false;
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.confirmDeleteDialog = true;
    },
    async deleteProduct() {
      await product.deleteProduct(this.productToDelete.id);
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
