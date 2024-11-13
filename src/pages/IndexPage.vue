<template>
  <q-page>
    <q-layout view="hHh Lpr fff">
      <!-- Barra Superior -->
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Dashboard de Ordens de Serviço</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <!-- Conteúdo Principal -->
      <q-page-container>
        <q-page-padding>
          <!-- Indicadores Principais -->
          <div class="row q-col-gutter-md">
            <q-card flat bordered class="col-3" v-for="indicator in indicators" :key="indicator.label">
              <q-card-section>
                <q-icon :name="indicator.icon" size="32px" :class="indicator.color" />
                <div class="text-h6">{{ indicator.label }}</div>
                <div class="text-subtitle1">{{ indicator.value }}</div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráficos e Tabelas -->
          <div class="row q-col-gutter-md q-mt-md">
            <!-- Gráfico de Distribuição de Ordens por Status -->
            <q-card class="col-6">
              <q-card-section>
                <div class="text-h6">Distribuição de Ordens por Status</div>
                <canvas id="statusChart"></canvas>
              </q-card-section>
            </q-card>

            <!-- Gráfico de Tendência de Novas Ordens -->
            <q-card class="col-6">
              <q-card-section>
                <div class="text-h6">Tendência de Novas Ordens</div>
                <canvas id="trendChart"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Tabela de Ordens Recentes -->
          <q-card class="q-mt-md">
            <q-card-section>
              <div class="text-h6">Ordens Recentes</div>
            </q-card-section>
            <q-table
              :rows="orders"
              :columns="orderColumns"
              row-key="id"
              hide-bottom
            >
              <template v-slot:body-cell-status="props">
                <q-chip :color="statusColor(props.row.status)" outline square>{{ props.row.status }}</q-chip>
              </template>
            </q-table>
          </q-card>
        </q-page-padding>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script>
import {Chart, registerables} from 'chart.js';
import {order as ordersService} from "../services/orders";
import {Customers as customersService} from '../services/customers';

Chart.register(...registerables);

export default {
  data() {
    return {
      indicators: [
        {label: 'Total de Ordens', value: 0, icon: 'assignment', color: 'text-primary'},
        {label: 'Em Andamento', value: 0, icon: 'hourglass_empty', color: 'text-warning'},
        {label: 'Concluídas', value: 0, icon: 'done', color: 'text-success'},
        {label: 'Canceladas', value: 0, icon: 'cancel', color: 'text-negative'},
      ],
      orders: [],
      orderColumns: [
        {name: 'id', label: 'ID', field: 'id', align: 'left'},
        {name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left'},
        {name: 'data', label: 'Data', field: 'data', align: 'left'},
        {name: 'responsavel', label: 'Responsável', field: 'responsavel', align: 'left'},
        {name: 'status', label: 'Status', field: 'status', align: 'left'},
      ],
      statusChartData: {
        labels: ['Pendentes', 'Em Andamento', 'Concluídas', 'Canceladas'],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: ['#FFC107', '#FF5722', '#4CAF50', '#F44336'],
          },
        ],
      },
      trendChartData: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
          {
            label: 'Novas Ordens',
            data: [0, 0, 0, 0],
            borderColor: '#42A5F5',
            fill: false,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      statusChart: null,
      trendChart: null,
    };
  },
  async mounted() {
    await this.fetchData();
    this.renderStatusChart();
    this.renderTrendChart();
  },
  methods: {
    async fetchData() {
      try {
        const ordersResponse = await ordersService.getOrders();
        this.orders = ordersResponse.data;

        this.indicators[0].value = this.orders.length;
        this.indicators[1].value = this.orders.filter(order => order.status === 'Em Andamento').length;
        this.indicators[2].value = this.orders.filter(order => order.status === 'Concluída').length;
        this.indicators[3].value = this.orders.filter(order => order.status === 'Cancelada').length;

        this.statusChartData.datasets[0].data = [
          this.orders.filter(order => order.status === 'Pendente').length,
          this.orders.filter(order => order.status === 'Em Andamento').length,
          this.orders.filter(order => order.status === 'Concluída').length,
          this.orders.filter(order => order.status === 'Cancelada').length,
        ];

        // Simulação de dados de tendência
        this.trendChartData.datasets[0].data = [10, 15, 5, 20]; // Substitua com dados reais
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    },
    renderStatusChart() {
      const ctx = document.getElementById('statusChart').getContext('2d');
      this.statusChart = new Chart(ctx, {
        type: 'pie',
        data: this.statusChartData,
        options: this.chartOptions,
      });
    },
    renderTrendChart() {
      const ctx = document.getElementById('trendChart').getContext('2d');
      this.trendChart = new Chart(ctx, {
        type: 'line',
        data: this.trendChartData,
        options: this.chartOptions,
      });
    },
    statusColor(status) {
      switch (status) {
        case 'Em Andamento':
          return 'warning';
        case 'Concluída':
          return 'positive';
        case 'Cancelada':
          return 'negative';
        default:
          return 'grey';
      }
    },
  },
};
</script>

<style scoped>
.q-card {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
