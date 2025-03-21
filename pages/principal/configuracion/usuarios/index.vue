<template>
  <v-container>
    <h1 class="text-4 mb-4">
      Gestion de Usuarios
    </h1>
    <!-- Renglon con el boton crear nuevo usuario -->
    <v-row align="center" justify="end">
      <v-btn color="primary" @click="openDialog('create')">
        <v-icon left>
          mdi-account-plus
        </v-icon>
        Crear Usuario
      </v-btn>
    </v-row>

    <!-- Tabla de los Usuarios -->
    <v-data-table
      :headers="headers"
      :items="usuarios"
      :items-per-page="10"
      dense
      class="mt-4"
    >
      <template #[`item.actions`]="{item}">
        <!-- Editar -->
        <v-icon small color="primary" title="Editar" @click="openDialog('edit', item)">
          mdi-pencil
        </v-icon>
        <!-- Borrar -->
        <v-icon small color="red" title="Borrar" @click="openDialog('delete', item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Dialog para crear o editar un usuario -->
    <v-dialog v-model="dialog" persistent max-width="700px">
      <v-card color="indigo lighten-5">
        <v-card-title>
          <span class="text-h6">
            {{ dialogMode === 'create' ? 'Crear Usuario' : 'Editar Usuario' }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.nombre"
                  label="Nombre"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.apaterno"
                  label="A. Apaterno"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.amaterno"
                  label="A. Materno"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="userData.direccion"
                  label="Direccion"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.telefono"
                  label="Teléfono"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.estado"
                  label="Estado"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.ciudad"
                  label="Ciudad"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.usuario"
                  label="Usuario"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="userData.password"
                  label="Password"
                  type="password"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="userData.rol"
                  :items="roles"
                  required
                  label="Rol"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn :disabled="!valid" @click="saveUser">
            {{ dialogMode === 'create' ? 'Crear' : 'Actualizar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para borrar usuario -->
    <v-dialog v-model="confirmDialog" persistent max-width="400px">
      <v-card color="indigo lighten-5">
        <v-card-title class="text-h6">
          Confirmación de Eliminación
        </v-card-title>
        <v-card-text>
          <template v-if="selectedUser">
            ¿Estás seguro que deseas eliminar al usuario
            <strong>{{ selectedUser.nombre }}</strong>?
          </template>
          <template v-else>
            Cargando Datos del Usuario...
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeConfirmDialog">
            Cancelar
          </v-btn>
          <v-btn text color="red" :disabled="!selectedUser" @click="deleteUser">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  layout: 'principal',
  middleware: 'auth',
  data () {
    return {
      usuarios: [],
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'A. Paterno', value: 'apaterno' },
        { text: 'A. Materno', value: 'amaterno' },
        { text: 'Usuario', value: 'usuario' },
        { text: 'Rol', value: 'rol' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      roles: ['admin', 'contabilidad', 'recursos', 'secretaria'],
      valid: false,
      dialog: false,
      confirmDialog: false,
      dialogMode: 'create', // create - edit
      userData: {
        nombre: '',
        apaterno: '',
        amaterno: '',
        direccion: '',
        telefono: '',
        ciudad: '',
        estado: '',
        usuario: '',
        password: '',
        rol: 'contabilidad'
      },
      selectedUser: null
    }
  },
  mounted () {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers () {
      try {
        const response = await this.$axios.get('/users')
        this.usuarios = response.data
      } catch (error) {
        const errorMessage = error.message || 'Error al cargar los usuarios'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    openDialog (mode, user = null) {
      this.dialogMode = mode
      if (mode === 'edit' && user) {
        this.dialog = true
        user.password = ''
        this.userData = { ...user }
      } else if (mode === 'create') {
        this.dialog = true
        this.userData = {
          nombre: '',
          apaterno: '',
          amaterno: '',
          direccion: '',
          telefono: '',
          ciudad: '',
          estado: '',
          usuario: '',
          password: '',
          rol: 'contabilidad'
        }
      } else if (mode === 'delete') {
        this.selectedUser = user
        this.confirmDialog = true
        console.log('@@ delete')
      }
    },
    closeConfirmDialog () {
      this.confirmDialog = false
      this.selectedUser = null
    },
    closeDialog () {
      this.dialog = false
    },
    saveUser () {
      if (this.dialogMode === 'create') {
        this.createUser()
      } else {
        this.updateUser()
      }
    },
    async createUser () {
      try {
        await this.$axios.post('/users/create', this.userData)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Usuario creado con exito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al crear el usuario'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async updateUser () {
      try {
        await this.$axios.put(`/users/update/${this.userData.id}`, this.userData)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Usuario actualizado con exito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al actualizar el usuario'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async deleteUser () {
      try {
        await this.$axios.delete(`/users/delete/${this.selectedUser.id}`)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Usuario borrado con exito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeConfirmDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al borrar el usuario'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
