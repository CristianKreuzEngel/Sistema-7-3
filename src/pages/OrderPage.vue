<script>
import {defineComponent, ref, reactive, onMounted, watch} from "vue";
import { order } from "../services/orders";
import { Services } from "src/services/services";
import jsPDF from "jspdf";
import moment from "moment";
import {useQuasar} from "quasar";

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
    const $q = useQuasar();
    const form = reactive({
      name: "",
      phone: "",
      totalValue: 0,
      expectedDate: "",
      accessories: "",
      mistakes: "",
      status: "pendente",
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
      { name: "name", label: "Nome", field: "name" },
      { name: "equipment", label: "Computador", field: "equipment" },
      { name: "expectedDate", label: "Previsão", field: "expectedDate", sortable: true },
      { name: "status", label: "Status", field: "status" },
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
      if (isEdit.value) {
        await order.updateOrder(form);
      } else {
        form.status = "pendente"
        await order.createOrder(form);
      }
      await getOrders();
      isOpen.value = false;

      generatePDF();
    };

    const generatePDF = () => {
      const doc = new jsPDF();


      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Ordem de Serviço", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.line(10, 25, 200, 25);


      doc.setFont("helvetica", "bold");
      doc.text("Detalhes do Cliente", 10, 35);
      doc.setFont("helvetica", "normal");
      doc.text(`Nome: ${form.name}`, 10, 45);
      doc.text(`Telefone: ${form.phone}`, 10, 55);


      doc.setFont("helvetica", "bold");
      doc.text("Informações do Serviço", 10, 70);
      doc.setFont("helvetica", "normal");
      doc.text(`Descrição do Problema:`, 10, 80);
      doc.text(form.problemDescription || "Não informado", 15, 90, { maxWidth: 180 });
      doc.text(`Equipamento: ${form.equipment || "Não informado"}`, 10, 105);
      doc.text(`Avarias: ${form.mistakes || "Não informado"}`, 10, 115);
      doc.text(`Orçamento: ${form.budget ? "Sim" : "Não"}`, 10, 125);


      if (!form.budget && form.totalValue) {
        doc.setFont("helvetica", "bold");
        doc.text("Valor Total:", 10, 140);
        doc.setFont("helvetica", "normal");
        doc.text(`R$ ${form.totalValue.toFixed(2)}`, 45, 140);
      }


      doc.setFont("helvetica", "bold");
      doc.text("Senha do Dispositivo:", 10, 160);
      doc.setFont("helvetica", "normal");
      doc.text("Escreva a senha:", 10, 170);
      doc.rect(50, 165, 100, 10);


      const startX = 160;
      const startY = 165;
      const radius = 5;
      const spacing = 20;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const x = startX + col * spacing;
          const y = startY + row * spacing;
          doc.circle(x, y, radius, "S");
        }
      }


      doc.setFont("helvetica", "bold");
      doc.text("Autorização do Cliente:", 10, 220);
      // doc.setFont("helvetica", "normal");
      // doc.text("Assinatura:", 10, 230);
      doc.line(40, 227, 140, 227);


      doc.line(10, 260, 200, 260);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Gerado automaticamente pelo sistema", 105, 270, { align: "center" });

      // Salva o PDF
      doc.save("ordem-de-servico.pdf");
    };


    const confirmDelete = (selectedOrder) => {
      productToDelete.value = selectedOrder;
      confirmDeleteDialog.value = true;
    };
    const startOrder = async (selectedOrder) => {
        selectedOrder.status = "em andamento"
        const resp = await order.updateOrder(selectedOrder);
        if(resp.data[0] === 1) {
          $q.notify({
            type: 'positive',
            message: 'Ordem iniciada'
          })
          await this.getOrders();
        }else{
          $q.notify({
            type: 'negative',
            message: 'Algo deu errado, por favor verifique'
          })
        }
    }

    const stopOrder = async (selectedOrder) => {
      selectedOrder.status = "finalizado"
      editOrder(selectedOrder);
    }
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
        expectedDate: "",
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
        if (!form.budget && newServiceId || isEdit.value === true && newServiceId) {
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
      startOrder,
      stopOrder,
      openModal,
      editOrder,
      submitForm,
      confirmDelete,
      deleteOrder,
      resetForm,
      handleFileUpload,
      moment,
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
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.status != 'finalizado'"
              flat
              dense
              :icon="props.row.status === 'pendente' ? 'play_arrow' : 'pause'"
              @click="props.row.status === 'pendente' ? startOrder(props.row) : stopOrder(props.row)"
              :color="props.row.status === 'pendente' ? 'green' : 'orange'"
            />
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
        <template v-slot:body-cell-expectedDate="props">
          <q-td :props="props" class="text-center">
            {{ moment(props.row.expectedDate).format("DD/MM/YYYY") }}
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
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  outlined
                  rounded
                  label="Nome completo"
                  v-model="form.name"
                  type="text"
                  required
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  rounded
                  label="Telefone/celular"
                  v-model="form.phone"
                  :mask="form.phone.length > 19 ? '' : '+55 (##) #####-####'"
                  type="tel"
                  required
                />
              </div>
            </div>

            <q-input
              class="q-mt-md"
              outlined
              rounded
              label="Descrição do problema"
              v-model="form.problemDescription"
              type="textarea"
              required
            />

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-6">
                  <q-select
                outlined
                rounded
                :options="equipmentOptions"
                option-value="value"
                option-label="label"
                label="Equipamento"
                v-model="form.equipment"
                emit-value
                type="text"
                required
              />

              </div>
              <div class="col-6">
                <q-input
                  outlined
                  rounded
                  label="Avarias"
                  v-model="form.mistakes"
                  type="text"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-6">
                <q-input
                  outlined
                  rounded
                  label="Acessórios"
                  v-model="form.accessories"
                  type="text"
                />
              </div>
              <div class="col-2">
                <q-input
                  outlined
                  rounded
                  type="date"
                  v-model="form.expectedDate"
                  label="Data esperada"
                />
              </div>
              <div class="col-4">
                <q-toggle
                  v-model="form.budget"
                  color="green"
                  label="Fazer orçamento"
                />
              </div>
            </div>
            <q-input
              v-if="isEdit"
              class="q-mt-md"
              outlined
              rounded
              label="Descrição do serviço"
              v-model="form.technicalDescription"
              type="textarea"
              required
            />
            <q-select
              v-if="isEdit"
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
              v-if="isEdit && form.idService"
              readonly
            />
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

            <q-btn type="submit" rounded :label="form.technicalDescription ? 'Finalizar ordem' : 'Salvar'" color="primary" class="q-mt-md" />
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
