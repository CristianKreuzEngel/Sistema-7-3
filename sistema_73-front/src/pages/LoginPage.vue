<script lang="ts">
import { defineComponent } from 'vue';
import { ILogin } from 'components/models';

export default defineComponent({
  name: 'LoginPage',
  data: () => {
    return {
      form: {
        username: '',
        password: ''
      } as ILogin,
    };
  }
});
</script>

<template>
  <div class="q-pa-md flex flex-center" style="height: 100vh;">
    <q-card
      class="my-card row items-center justify-evenly"
      square
      bordered
      flat
    >
      <q-form
        class="q-gutter-md"
      >
      <q-input
        outlined
        label="Username"
        v-model="form.username"
        type="text"
      />
      <q-input
        outlined
        label="Password"
        v-model="form.password"
        type="password"
      />
      <q-btn
        label="Entrar"
        color="primary"
        type="submit"
      />
      </q-form>
    </q-card>
  </div>
</template>

<style scoped>
.my-card {
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 400px;
}
</style>
