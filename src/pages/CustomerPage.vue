<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import {Customers} from "src/services/customers";

export default defineComponent({
  name: "CustomersPage",
  setup() {
    const maximizedToggle = ref(true);
    const customers = ref([]);
    const isOpen = ref(false);
    const isEdit = ref(false);
    const loading = ref(true);
    const confirmDeleteDialog = ref(false);
    const customerToDelete = ref(null);

    const form = reactive({
      name: "",
      phone: "",
      address: "",
      documents: "",
      isActive: 1,
    });
    const columns = [
      {name: "id", label: "Código", field: "id", sortable: true},
      { name: "name", label: "Nome", field: "name", sortable: true },
      { name: "phone", label: "Telefone", field: "phone", sortable: true },
      { name: "documents", label: "Documentos", field: "documents", sortable: true },
      { name: "actions", label: "Ações", field: "actions", sortable: false },
    ];

    const getCustomers = async () => {
      loading.value = true;
      customers.value = await Customers.getCustomers();
      loading.value = false;
    };

    const openModal = () => {
      isEdit.value = false;
      isOpen.value = true;
      resetForm();
    };

    const editCustomer = (selectedService) => {
      isEdit.value = true;
      isOpen.value = true;
      Object.assign(form, selectedService);
    };

    const submitForm = async () => {
      if (isEdit.value) {
        await Customers.updateCustomer(form);
      } else {
        await Customers.createCustomer(form);
      }
      await getCustomers();
      isOpen.value = false;
    };

    const confirmDelete = (selectedService) => {
      customerToDelete.value = selectedService;
      confirmDeleteDialog.value = true;
    };

    const deleteCustomer = async () => {
      await Customers.deleteCustomer(customerToDelete.value.id);
      await getCustomers();
      confirmDeleteDialog.value = false;
    };

    const resetForm = () => {
      Object.assign(form, {
        name: "",
        phone: "",
        address: "",
        documents: "",
        isActive: 1,
      });
    };
    onMounted(() => {
      getCustomers();
    });

    return {
      maximizedToggle,
      isOpen,
      isEdit,
      loading,
      customers,
      confirmDeleteDialog,
      customerToDelete,
      form,
      columns,
      getCustomers,
      openModal,
      editCustomer,
      submitForm,
      confirmDelete,
      deleteCustomer,
      resetForm,
    };

  },
});
</script>
<template>
  <div>
    <q-card class="q-ma-md" >
      <q-btn @click="openModal" class="q-ma-md"  icon="add_circle"  label="NOVO CLIENTE" color="primary" />
      <q-table
        :rows="customers"
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
              @click="editCustomer(props.row)"
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

    <q-dialog v-model="isOpen" persistent>
      <q-card>
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ isEdit ? "Editar" : "Cadastrar" }} Cliente
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
              label="Telefone/celular"
              v-model="form.phone"
              mask="+55 (##) #####-####"
              type="tel"
              required
            />
            <q-input
              class="q-mt-md"
              outlined
              label="CPF/CNPJ"
              v-model="form.documents"
              type="text"
              :mask="form.documents.length > 11 ? '##.###.###/####-##' : '###.###.###-##'"
              required
            />

            <q-input
              class="q-mt-md"
              outlined
              label="Endereço"
              v-model="form.address"
              type="text"
            />
            <q-btn type="submit" label="Salvar" color="primary" class="q-mt-md" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteDialog">
      <q-card>
        <q-card-section>
          Tem certeza que deseja excluir o cliente?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="red" @click="deleteCustomer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>

</style>
