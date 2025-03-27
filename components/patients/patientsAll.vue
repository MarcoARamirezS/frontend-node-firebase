<template>
  <v-container>
    <v-row align="center" justify="end">
      <div>
        <span class="title">
          Lab Appointments
        </span>
      </div>
      <v-spacer />
      <v-text-field
        label="Search"
        append-icon="mdi-magnify"
        single-line
        hide-details
        outlined
        class="mr-4"
      />
      <v-btn class="btnFilter">
        <span>
          Filter
        </span>
        <v-icon>
          mdi-filter-outline
        </v-icon>
      </v-btn>
      <v-btn class="btnPatient">
        <v-icon>
          mdi-plus
        </v-icon>
        <span>
          Add Patient
        </span>
      </v-btn>
    </v-row>
    <v-row align="center" justify="start">
      <v-data-table
        class="mt-4"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      pacientes: []
    }
  },
  mounted () {
    this.loadPacientes()
  },
  methods: {
    async loadPacientes () {
      try {
        const response = await this.$axios.get('/pacientes')
        console.log('@@@ response =>', response)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: 500;
  color: #101828;
}
.btnFilter {
  background-color: white !important;
  color: #101828 !important;
  margin-right: 10px !important;
  border: 1px solid #101828 !important;
  border-radius: 5px !important;
  padding: 5px 10px !important;
  font-size: 14px !important;
  text-transform: none !important;
}
.btnPatient {
  text-transform: none !important;
  color: white !important;
  border-radius: 5px !important;
  padding: 5px 10px !important;
  background-color: #0E1680 !important;
  font-size: 14px !important;
  margin-right: 10px !important;
  font-weight: 500 !important;
}
</style>
