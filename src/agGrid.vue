
  
  <script>
  import { AgGridVue } from 'ag-grid-vue3';
  
  export default {
    components: {
      AgGridVue,
    },
    data() {
      return {
        columnDefs: [
          { field: 'make' },
          { field: 'model' },
          { field: 'price' }
        ],
        rowData: [
          { make: 'Toyota', model: 'Celica', price: 35000 },
          { make: 'Ford', model: 'Mondeo', price: 32000 },
          { make: 'Porsche', model: 'Boxster', price: 72000 }
        ]
      };
    }
  };
  </script>

<template>
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 500px;"
      :columnDefs="columnDefs"
      :rowData="rowData"
    ></ag-grid-vue>
  </template>
  
 
  