<script lang="js">
import { defineComponent, reactive } from 'vue';
import { auth } from '../services/auth';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const form = reactive({
      login: '',
      password: ''
    });

    const onSubmit = async () => {
      try {
        const resp = await auth.makeLogin(form);
        console.log('estou if');
        $q.notify({
          type: 'positive',
          message: 'Login efetuado com sucesso!'
        });
        await router.push('/');
      } catch (err) {
        console.log('to no catch ' + err.message);
        $q.notify({
          type: 'negative',
          message: 'Login ou senha incorretos. Por favor verifique!'
        });
      }
    };

    return {
      form,
      onSubmit
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
        @submit="onSubmit"
      >
      <q-input
        outlined
        label="Username"
        v-model="form.login"
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
