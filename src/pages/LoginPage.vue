<script lang="js">
import { defineComponent } from 'vue';
import {auth} from '../services/auth'

export default defineComponent({
  name: 'LoginPage',
  data: () => {
    return {
      form: {
        login: '',
        password: ''
      }
    };
  },
  methods:{
    async onSubmit(){
        await auth.makeLogin(this.form).then(async resp => {
          console.log(resp)
          if (resp.status === 200) {
            await this.$router.push('/');
          }else{
            throw new Error(resp.statusText);
          }
        });
    }
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
