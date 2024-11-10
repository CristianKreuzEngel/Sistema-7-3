<script>
import {defineComponent, ref, reactive, onMounted, watch} from "vue";
import { order } from "../services/orders";
import { Services } from "src/services/services";
import jsPDF from "jspdf";

export default defineComponent({
  name: "OrdersPage",
  setup() {
    const maximizedToggle = ref(true);
    const orders = ref([]);
    const isOpen = ref(false);
    const isEdit = ref(false);
    const loading = ref(true);
    const confirmDeleteDialog = ref(false);
    const productToDelete = ref(null);
    const file = ref(null);
    const servicesOptions = ref([]);

    const form = reactive({
      name: "",
      phone: "",
      totalValue: 0,
      accessories: "",
      mistakes: "",
      problemDescription: "",
      technicalDescription: "",
      equipment: "",
      budget: true,
      isActive: true,
    });

    const equipmentOptions = [
      { label: 'Celular', value: 'celular' },
      { label: 'Computador', value: 'computador' },
      { label: 'Notebook', value: 'notebook' },
      { label: 'Outro', value: 'outro' },
    ];

    const columns = [
      { name: "name", label: "Nome", field: "name", sortable: true },
      { name: "price", label: "Preço", field: "price", sortable: true },
      { name: "voltage", label: "Voltagem", field: "voltage" },
      { name: "cod", label: "Código", field: "cod" },
      { name: "isActive", label: "Status", field: "isActive" },
      { name: "actions", label: "Ações", field: "actions", sortable: false },
    ];

    const getOrders = async () => {
      loading.value = true;
      orders.value = await order.getOrders();
      loading.value = false;
    };

    const getServices = async () => {
      loading.value = true;
      await Services.getServices().then((resp) => {
        resp.map((a) => {
          servicesOptions.value.push({ label: a.name, value: a.id, price: a.price, });
        });
      });
      loading.value = false;
    };

    const openModal = () => {
      isEdit.value = false;
      isOpen.value = true;
      resetForm();
    };

    const editOrder = (selectedOrder) => {
      isEdit.value = true;
      isOpen.value = true;
      Object.assign(form, selectedOrder);
    };

    const submitForm = async () => {
      const formData = new FormData();
      if (isEdit.value) {
        await order.updateOrder(form);
      } else {
        formData.append("name", form.name);
        formData.append("price", form.totalValue);
        formData.append("equipment", form.equipment);
        formData.append("file", file.value);
        await order.createOrder(formData);
      }
      await getOrders();
      isOpen.value = false;

      generatePDF();
    };

    const generatePDF = () => {
      const doc = new jsPDF();
      doc.text("Detalhes da Ordem", 10, 10);
      doc.text(`Nome: ${form.name}`, 10, 20);
      doc.text(`Telefone: ${form.phone}`, 10, 30);
      doc.text(`Descrição do Problema: ${form.problemDescription}`, 10, 40);
      doc.text(`Equipamento: ${form.equipment}`, 10, 50);
      doc.text(`Avarias: ${form.mistakes}`, 10, 60);
      doc.text(`Orçamento: ${form.budget ? "Sim" : "Não"}`, 10, 70);
      doc.text(`Valor Total: ${form.totalValue}`, 10, 80);

      doc.save("ordem.pdf");
    };

    const confirmDelete = (selectedOrder) => {
      productToDelete.value = selectedOrder;
      confirmDeleteDialog.value = true;
    };

    const deleteOrder = async () => {
      await order.deleteOrder(productToDelete.value.id);
      await getOrders();
      confirmDeleteDialog.value = false;
    };

    const resetForm = () => {
      Object.assign(form, {
        name: "",
        phone: "",
        totalValue: 0,
        accessories: "",
        problemDescription: "",
        technicalDescription: "",
        equipment: "",
        idService: null,
        budget: true,
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

    watch(
      () => form.idService,
      (newServiceId) => {
        if (!form.budget && newServiceId) {
          const selectedService = servicesOptions.value.find(
            (service) => service.value === newServiceId.value
          );
          if (selectedService) {
            form.totalValue = selectedService.price;
          }
        }
      }
    );

    onMounted(() => {
      getOrders();
      getServices();
    });

    return {
      maximizedToggle,
      orders,
      isOpen,
      isEdit,
      loading,
      confirmDeleteDialog,
      productToDelete,
      form,
      file,
      equipmentOptions,
      servicesOptions,
      columns,
      getOrders,
      openModal,
      editOrder,
      submitForm,
      confirmDelete,
      deleteOrder,
      resetForm,
      handleFileUpload,
    };
  },
});
</script>

<template>
  <div>
    <q-card class="q-ma-md" >
      <q-btn @click="openModal" class="q-ma-md"  icon="add_circle"  label="NOVA ORDEM" color="primary" />
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
              @click="editOrder(props.row)"
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
              label="Descrição do problema"
              v-model="form.problemDescription"
              type="textarea"
              required
            />
            <q-select
              class="q-mt-md"
              outlined
              rounded
              :options="equipmentOptions"
              option-value="value"
              option-label="label"
              label="Equipamento"
              v-model="form.equipment"
              type="text"
              required
            />
            <q-input
              class="q-mt-md"
              outlined
              rounded
              label="Avarias"
              v-model="form.mistakes"
              type="text"
            />
            <div class="q-mt-md">
              <q-toggle
                v-model="form.budget"
                color="green"
                label="Fazer orçamento"
              />
            </div>
            <q-select
              v-if="!form.budget"
              class="q-mt-md"
              outlined
              rounded
              :options="servicesOptions"
              option-value="value"
              option-label="label"
              label="Serviço"
              v-model="form.idService"
              type="text"
              required
            />
            <q-input
              v-model="form.totalValue"
              class="q-mt-md"
              outlined
              rounded
              v-if="!form.budget && form.idService"
              readonly
            />

            <q-btn type="submit" rounded label="Salvar" color="primary" class="q-mt-md" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteDialog">
      <q-card>
        <q-card-section>
          Tem certeza que deseja excluir a ordem?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="red" @click="deleteOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>

</style>
