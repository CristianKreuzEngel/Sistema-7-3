<script>
import {defineComponent, ref} from "vue";
import { order } from "../services/orders";

export default defineComponent({
  name: "OrdersPage",
  data: () => ({
    maximizedToggle: ref(true),
    orders: [],
    isOpen: false,
    isEdit: false,
    loading: true,
    confirmDeleteDialog: false,
    productToDelete: null,
    form: {
      name: "",
      price: 0,
      voltage: "220V",
      cod: "",
      image: "",
      isActive: true,
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
    async getOrders() {
      this.loading = true;
      this.orders = await product.getOrders();
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
      this.getOrders();
      this.isOpen = false;
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.confirmDeleteDialog = true;
    },
    async deleteProduct() {
      await product.deleteProduct(this.productToDelete.id);
      this.getOrders();
      this.confirmDeleteDialog = false;
    },
    resetForm() {
      this.form = {
        name: "",
        price: 0,
        voltage: "220V",
        cod: "",
        image: "",
        isActive: true,
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
    this.getOrders();
  },
});
</script>


<template>
  <div>
    <q-card class="q-ma-md" >
      <q-btn @click="openModal" class="q-ma-md"  icon="add_circle"  label="ADICIONAR" color="primary" />
      <q-table
        :rows="orders"
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
              round
              icon="delete"
              @click="confirmDelete(props.row)"
              color="red"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog
      v-model="isOpen"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ isEdit ? "Editar" : "Cadastrar" }} Ordem
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitForm" class="q-my-md">
            <q-input
              class="q-mt-md"
              outlined
              rounded
              label="Nome completo"
              v-model="form.name"
              type="text"
              required
              style="width: 300px;" <!-- Defina a largura fixa aqui -->
            />

            <q-input
              class="q-mt-md"
              outlined
              rounded
              label="Telefone/celular"
              v-model="form.phone"
              mask="+55 (##) #####-####"
              type="tel"
              required
            />
            <q-input
              class="q-mt-md"
              outlined
              rounded
              label="Descricao do problema"
              v-model="form.desc"
              type="textarea"
              required
            />
            <q-input
              class="q-mt-md"
              outlined
              rounded
              v-model="form.desc"
              label="Preço"
              mask="#.##"
              reverse-fill-mask
              input-class="text-right"
            />
            <q-input
              class="q-mt-md"
              outlined
              rounded
              label="Código"
              v-model="form.cod"
              type="text"
              required
            />
            <q-input
              v-if="isEdit"
              class="q-mt-md"
              outlined
              label="Nome"
              v-model="form.image"
              type="text"
              required
            />
            <div>
              <p>{{ isEdit ? "Alterar a " : "" }} Imagem</p>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                @change="handleFileUpload"
              />
            </div>

            <div class="q-mt-md">
              <q-radio
                v-model="form.isActive"
                :val="true"
                label="Ativo"
                color="green"
              />
              <q-radio
                v-model="form.isActive"
                :val="false"
                label="Inativo"
                color="red"
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

<style scoped>

</style>
