<template>
  <div class="login">
    <h1 style="align-self: center;">Créer un compte</h1>
    <label>
      Votre clé alpha
      <input type="text" name="Clé alpha" v-model="alpha_key" />
    </label>
    <label>
      Votre pseudo
      <input type="text" name="Clé alpha" v-model="pseudo" />
    </label>
    <label>
      Choisissez un mot de passe
      <input type="password" name="Mot de passe" v-model="pwd" />
    </label>
    <label>
      Confirmer votre mot de passe
      <input type="password" name="Mot de passe confirmation" v-model="pwd_second" />
      <p v-if="!same_pwd" class="error">
        Les mots de passe ne sont pas identiques
      </p>
    </label>
    <button @click="submit" style="align-self: center;">Envoyer</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pseudo: '',
      alpha_key: '',
      pwd: '',
      pwd_second: '',
    }
  },
  computed: {
    same_pwd() {
      return this.pwd === this.pwd_second
    },
  },
  methods: {
    async submit() {
      if (this.same_pwd && this.alpha_key && this.pwd && this.pseudo) {
        fetch(process.env.VUE_APP_API_URL + 'users/add', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            pseudo: this.pseudo,
            alpha_key: this.alpha_key,
            pwd: this.pwd,
          }),
        })
          .then((response) => {
            return response.json()
          })
          .then(() => {})
      }
    },
  },
}
</script>

<style>
.login {
  width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid gray;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.login * {
  margin: 5px 0;
}

.error {
  color: red;
  font-style: italic;
}
</style>
