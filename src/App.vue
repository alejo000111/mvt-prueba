<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from './firebase'; //Importar conexión
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import type { Entrenamiento } from './types/Entrenamiento'; //Importar la interfaz

// ---ESTADO (mis variables) ---
const entrenamientos = ref<Entrenamiento[]>([]);
const cargando = ref(true);
const editandoId = ref<string | null>(null);

//Formulario inicial en blanco 
const formulario = ref<Entrenamiento>({
  fecha: '',
  duracion: 0,
  distancia: 0
});

//--- Mis funciones --

//1. Cargar los datos en tiempo real/onSnapshot
onMounted(() => {
  const q = query(collection(db, 'entrenamientos'), orderBy('fecha', 'desc'));

  onSnapshot(q, (snapshot) => {
    entrenamientos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Entrenamiento));
    cargando.value = false;
  });
});
    
//2. Guardar (Ya sea crear o editar)
const guardarEntrenamiento = async () => {
  //Validación simple
  if (!formulario.value.fecha || formulario.value.duracion <= 0 || formulario.value.distancia <= 0) {
    alert("Por favor, completa todos los datos correctamente");
    return;
  }

  try{
    if (editandoId.value) {
      //Modo editor: Actualizar documento existente
      const refDoc = doc(db, 'entrenamientos', editandoId.value);
      await updateDoc(refDoc, {
        fecha: formulario.value.fecha,
        duracion: formulario.value.duracion,
        distancia: formulario.value.distancia
      });
      alert("Entrenamiento actualizado con éxito");
    } else {
      //Modo creador: Crear documento nuevo
      await addDoc(collection(db, 'entrenamientos'), formulario.value);
      alert("Entrenamiento registrado con éxito");
    }
    limpiarFormulario();
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Hubo un error al guardar.");
  }
};

//3. Eliminar
const eliminarEntrenamiento = async (id:string) => {
  if (confirm("¿Estás seguro de borrar este entrenamiento?:(")) {
    try {
      await deleteDoc(doc(db, 'entrenamientos', id));
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  }
};

//4. Preparar edición (Cargar datos en el form)
const cargarEdicion = (entrenamiento: Entrenamiento) => {
  formulario.value = { ...entrenamiento }; //Copia de los datos
  editandoId.value = entrenamiento.id || null;
};

//5. Cancelar o limpiar formulario
const limpiarFormulario = () => {
  formulario.value = { fecha: '', duracion: 0, distancia: 0};
  editandoId.value = null;
};
</script>

<template>
  <div class="contenedor">
    <div class="header">
      <h1>Registro de Entrenamientos</h1>
      <p class="subtitle">Panel de Control - My Virtual Trainer</p>
    </div>

    <div class="card formulario">
      <h2>{{ editandoId ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}</h2>

      <div class="grid-form">
        <div class="campo">
          <label>Fecha del entrenamiento:</label>
          <input type="date" v-model="formulario.fecha">
        </div>

        <div class="campo">
          <label>Duración (min):</label>
          <input type="number" v-model.number="formulario.duracion" placeholder="0">
        </div>

        <div class="campo">
          <label>Distancia (km):</label>
          <input type="number" step="0.1" v-model.number="formulario.distancia" placeholder="0.0">
        </div>
      </div>

      <div class="botones-form">
        <button @click="guardarEntrenamiento" class="btn-guardar">
          {{ editandoId ? 'Actualizar Registro' : 'Registrar Sesión' }}
        </button>
        
        <button v-if="editandoId" @click="limpiarFormulario" class="btn-cancelar">
          Cancelar Edición
        </button>
      </div>
    </div>

    <div class="historial">
      <div class="historial-header">
        <h2>Historial de Sesiones!!</h2>
      </div>
      
      <p v-if="cargando" class="mensaje-estado">Cargando datos del servidor...</p>
      <p v-else-if="entrenamientos.length === 0" class="mensaje-estado">No hay registros aún</p>

      <div class="grid-cards" v-else>
        <div v-for="item in entrenamientos" :key="item.id" class="card entrenamiento-card">
          
          <div class="card-header">
            <h3>{{ item.fecha }}</h3>
          </div>
          
          <div class="info">
            <div class="dato">
              <span class="label">Duración</span>
              <span class="valor">{{ item.duracion }} min</span>
            </div>
            <div class="dato">
              <span class="label">Distancia</span>
              <span class="valor">{{ item.distancia }} km</span>
            </div>
          </div>

          <div class="card-actions">
            <button @click="cargarEdicion(item)" class="btn-link">Editar</button>
            <button @click="eliminarEntrenamiento(item.id!)" class="btn-link btn-danger">Eliminar</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fuentes y colores MVT */
:root {
  --primary: #0056b3; /* Azul parecido */
  --text-dark: #333333;
  --text-light: #666666;
  --bg-light: #f4f7f6;
  --white: #ffffff;
}

.contenedor {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-dark);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 5px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

/* Formulario */
.card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 30px;
  border: 1px solid #e1e4e8;
}

.formulario {
  background-color: #ffffff;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 600px) {
  .grid-form {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.campo label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.campo input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.campo input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
}

.botones-form {
  margin-top: 25px;
  display: flex;
  gap: 15px;
}

button {
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  border-radius: 4px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.2s;
}

.btn-guardar {
  background-color: #2c3e50;
  color: white;
  flex: 1;
}

.btn-guardar:hover {
  background-color: #1a252f;
}

.btn-cancelar {
  background-color: #95a5a6;
  color: white;
}

/* Historial */
.mensaje-estado {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 20px;
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.entrenamiento-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 4px solid #3498db; /* Acento de color */
  transition: transform 0.2s;
}

.entrenamiento-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.info {
  margin: 15px 0;
}

.dato {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  border-bottom: 1px dotted #eee;
  padding-bottom: 4px;
}

.dato .label {
  color: #7f8c8d;
}

.dato .valor {
  font-weight: bold;
  color: #2c3e50;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.btn-link {
  background: none;
  color: #3498db;
  padding: 5px;
  font-size: 0.85rem;
  text-decoration: underline;
}

.btn-link:hover {
  color: #2980b9;
}

.btn-danger {
  color: #e74c3c;
}

.btn-danger:hover {
  color: #c0392b;
}
</style>