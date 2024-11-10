<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import {Services} from "src/services/services";

export default defineComponent({
  name: "ServicesPage",
  setup() {
    const maximizedToggle = ref(true);
    const service = ref([]);
    const isOpen = ref(false);
    const isEdit = ref(false);
    const loading = ref(true);
    const confirmDeleteDialog = ref(false);
    const serviceToDelete = ref(null);

    const form = reactive({
      name: "",
      price: 0,
      isActive: true,
    });
    const columns = [
      { name: "name", label: "Nome", field: "name", sortable: true },
      { name: "price", label: "Preço", field: "price", sortable: true },
      { name: "actions", label: "Ações", field: "actions", sortable: false },
    ];

    const getServices = async () => {
      loading.value = true;
      service.value = await Services.getServices();
      loading.value = false;
    };

    const openModal = () => {
      isEdit.value = false;
      isOpen.value = true;
      resetForm();
    };

    const editService = (selectedService) => {
      isEdit.value = true;
      isOpen.value = true;
      Object.assign(form, selectedService);
    };

    const submitForm = async () => {
      if (isEdit.value) {
        await Services.updateService(form);
      } else {
        await Services.createService(form);
      }
      await getServices();
      isOpen.value = false;
    };

    const confirmDelete = (selectedService) => {
      serviceToDelete.value = selectedService;
      confirmDeleteDialog.value = true;
    };

    const deleteService = async () => {
      await Services.deleteService(serviceToDelete.value.id);
      await getServices();
      confirmDeleteDialog.value = false;
    };

    const resetForm = () => {
      Object.assign(form, {
        name: "",
        price: 0,
        isActive: true,
      });
    };
    onMounted(() => {
      getServices();
    });

    return {
      maximizedToggle,
      service,
      isOpen,
      isEdit,
      loading,
      confirmDeleteDialog,
      serviceToDelete,
      form,
      columns,
      getServices,
      openModal,
      editService,
      submitForm,
      confirmDelete,
      deleteService,
      resetForm,
    };

  },
});
</script>
<template>
  <div>
    <q-card class="q-ma-md" >
      <q-btn @click="openModal" class="q-ma-md"  icon="add_circle"  label="NOVO SERVIÇO" color="primary" />
      <q-table
        :rows="service"
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
              @click="editService(props.row)"
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

    <q-dialog v-model="isOpen">
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ isEdit ? "Editar" : "Cadastrar" }} Serviço
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
            <q-btn type="submit" label="Salvar" color="primary" class="q-mt-md" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteDialog">
      <q-card>
        <q-card-section>
          Tem certeza que deseja excluir o serviço?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="red" @click="deleteService" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>

</style>
