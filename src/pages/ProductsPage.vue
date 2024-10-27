<template>
  <div>
    <q-card class="q-ma-md" >
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

      <q-btn @click="openModal" class="q-ma-md"  label="ADICIONAR" color="primary" />
    </q-card>

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
              v-model="form.price"
              label="Preço"
              mask="#.##"
              reverse-fill-mask
              input-class="text-right"
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

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { product } from "../services/products";
import {useQuasar} from "quasar";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

export default defineComponent({
  name: "ProductsPage",
  setup() {
    const $q = useQuasar();
    const products = ref([]);
    const isOpen = ref(false);
    const isEdit = ref(false);
    const loading = ref(true);
    const confirmDeleteDialog = ref(false);
    const productToDelete = ref(null);
    const file = ref(null);

    const form = reactive({
      name: "",
      price: 0,
      voltage: "220V",
      cod: "",
      image: "",
      isActive: true,
    });

    const voltageOptions = [
      { label: '110V', value: '110' },
      { label: '220V', value: '220' }
    ];

    const columns = [
      { name: "name", label: "Nome", field: "name", sortable: true },
      { name: "price", label: "Preço", field: "price", sortable: true },
      { name: "voltage", label: "Voltagem", field: "voltage" },
      { name: "cod", label: "Código", field: "cod" },
      { name: "isActive", label: "Status", field: "isActive" },
      { name: "actions", label: "Ações", field: "actions", sortable: false },
    ];

    const getProducts = async () => {
      loading.value = true;
      products.value = await product.getProducts();
      loading.value = false;
    };

    const openModal = () => {
      isEdit.value = false;
      isOpen.value = true;
      resetForm();
    };

    const editProduct = (product) => {
      console.log(product);
      isEdit.value = true;
      isOpen.value = true;
      Object.assign(form, product);
    };

    const submitForm = async () => {
      const formData = new FormData();
      if (isEdit.value) {
        await product.updateProduct(form).then(resp => {
          console.log('resp');
          console.log(resp);
          if( resp.data[0] === 1 ) {}
          $q.notify({
            type: 'positive',
            message: 'Produto atualizado com sucesso!'
          })
        });
      } else {
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("voltage", form.voltage);
        formData.append("cod", form.cod);
        formData.append("file", file.value);
        await product.createProduct(formData).then(response => {
          if(response.data.msg === 'Success'){
            $q.notify({
              type: 'positive',
              message: 'Produto criado com sucesso!'
            })
          }
        });
      }
      await getProducts();
      isOpen.value = false;
    };

    const confirmDelete = (product) => {
      productToDelete.value = product;
      confirmDeleteDialog.value = true;
    };

    const deleteProduct = async () => {
      await product.deleteProduct(productToDelete.value.id);
      await getProducts();
      confirmDeleteDialog.value = false;
    };

    const resetForm = () => {
      Object.assign(form, {
        name: "",
        price: 0,
        voltage: "220V",
        cod: "",
        image: "",
        isActive: true,
      });
      file.value = null;
    };

    const handleFileUpload = (event) => {
      const uploadedFile = event.target.files[0];
      if (uploadedFile) {
        file.value = uploadedFile;
      }
    };

    onMounted(() => {
      getProducts();
    });

    return {
      products,
      isOpen,
      isEdit,
      loading,
      confirmDeleteDialog,
      productToDelete,
      form,
      file,
      voltageOptions,
      columns,
      getProducts,
      openModal,
      editProduct,
      submitForm,
      confirmDelete,
      deleteProduct,
      resetForm,
      handleFileUpload,
    };
  },
});
</script>
