<template>
  <div class="avatar-uploader">
    <img :src="avatarUrl" alt="Avatar" />
    <input type="file" @change="onFileChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AvatarUploader",
  props: {
    avatarUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["avatarUpdated"],
  methods: {
    onFileChange(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAvatarUrl = e.target?.result as string;
          this.$emit("avatarUpdated", newAvatarUrl);
        };
        reader.readAsDataURL(file);
      }
    },
  },
});
</script>

<style scoped>
.avatar-uploader img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrar en el eje horizontal */
  justify-content: center; /* Centrar en el eje vertical */
}

.avatar-uploader img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}
</style>
