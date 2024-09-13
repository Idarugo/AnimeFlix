<template>
  <div>
    <form @submit.prevent="saveAnime">
      <div class="form-group mb-3">
        <label for="title" class="form-label">Título:</label>
        <input
          v-model="anime.titulo"
          id="title"
          type="text"
          class="form-control"
          required
        />
      </div>
      <div class="form-group mb-3">
        <label for="description" class="form-label">Descripción:</label>
        <textarea
          v-model="anime.descripcion"
          id="description"
          class="form-control"
          required
        ></textarea>
      </div>
      <div class="form-group mb-3">
        <label for="image" class="form-label">Imagen:</label>
        <input
          @change="onFileChange"
          id="image"
          type="file"
          class="form-control"
          accept="image/*"
        />
      </div>
      <div class="form-group mb-3">
        <label for="clasificacion" class="form-label"
          >Clasificación de Edad:</label
        >
        <select
          v-model="anime.clasificacion_edad_id"
          id="clasificacion"
          class="form-select"
          required
        >
          <option value="" disabled>Seleccione una clasificación</option>
          <option
            v-for="clasificacion in clasificaciones"
            :key="clasificacion.id"
            :value="clasificacion.id"
          >
            {{ clasificacion.nombre }}
          </option>
        </select>
      </div>
      <div v-if="anime.imagen_url" class="mb-3">
        <label class="form-label">Previsualización de Imagen:</label>
        <div class="text-center">
          <img
            :src="anime.imagen_url"
            alt="Imagen del anime"
            class="img-fluid"
            style="max-height: 200px"
          />
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-agregar">
          {{ isEditing ? "Guardar Cambios" : "Añadir" }}
        </button>
        <button type="button" class="btn btn-secondary" @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAnimeStore } from "../store/animeStore";

interface Anime {
  id?: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  clasificacion_edad_id: number | null;
}

export default defineComponent({
  name: "AnimeForm",
  props: {
    animeId: {
      type: Number,
      required: false,
    },
  },
  setup(props, { emit }) {
    const store = useAnimeStore();
    const anime = ref<Anime>({
      titulo: "",
      descripcion: "",
      imagen_url: "",
      clasificacion_edad_id: null,
    });
    const clasificaciones = ref<any[]>([]);
    const isEditing = computed(() => store.isEditMode);
    const selectedFile = ref<File | null>(null);

    const fetchClasificaciones = async () => {
      try {
        const response = await fetch(
          "https://localhost:3000/api/clasificacion_edad"
        );
        clasificaciones.value = await response.json();
      } catch (error) {
        console.error("Error al cargar clasificaciones:", error);
      }
    };

    onMounted(() => {
      fetchClasificaciones();
      if (props.animeId) {
        const existingAnime = store.animes.find(
          (anime) => anime.id === props.animeId
        );
        if (existingAnime) {
          anime.value = { ...existingAnime };
        }
      }
    });

    const onFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0];
      }
    };

    const saveAnime = async () => {
      const formData = new FormData();
      formData.append("titulo", anime.value.titulo);
      formData.append("descripcion", anime.value.descripcion);
      formData.append(
        "clasificacion_edad_id",
        anime.value.clasificacion_edad_id?.toString() || ""
      );

      if (selectedFile.value) {
        formData.append("imagen", selectedFile.value);
      }

      if (isEditing.value) {
        await store.updateAnime(anime.value.id!, formData);
      } else {
        await store.addAnime(formData);
      }
      emit("save");
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      anime,
      isEditing,
      saveAnime,
      cancel,
      onFileChange,
      clasificaciones,
    };
  },
});
</script>
