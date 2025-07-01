import service from "../service";
import { ref } from "vue";

export const usePokemons = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const pokemons = ref([]);
  const isLoading = ref(false);

  const fetchPokemons = async () => {
    isLoading.value = true;
    try {
      const res = await service.pokemons.fetchPokemons(query.value);
      console.log("Full API Response Data:", res.data);

      const fetchedData = res.data.results; // 👈 เปลี่ยนตรงนี้
      pokemons.value = fetchedData.map((item) => ({
        name: item.name,
        url: item.url,
      }));
      console.log("pokemons updated:", pokemons.value);
    } catch (err) {
      console.error("Error fetching pokemons:", err);
      pokemons.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    pokemons,
    isLoading,
    fetchPokemons,
  };
};
