import service from "~/service";

export const useProduct = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const products = ref([]);
  const rooms = ref([]);

  const loading = ref(false);
  const addProduct = () => {
    products.value.push({
      id: products.value.length + 1,
      name: "Product" + (products.value.length + 1),
      price: 100,
      description: "description" + (products.value.length + 1),
      image: "",
      stock: 10,
    });
  };

  const getRooms = async () => {
    loading.value = true;
    await service.product
      .getRooms(query.value)
      .then((res) => {
        console.log(res.data);
        const { data } = res.data;
        const rooms = ref([]);
        for (let i = 0; i < data.length; i++) {
          const e = data[i];
          const room = {
            id: e.id,
            name: e.name,
            hash_password: e.hash_password,
          };
          rooms.value.push(room);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const getProductList = async () => {
    loading.value = true;
    await service.product
      .getProductList(query.value)
      .then((res) => {
        console.log(res.data);
        const { data } = res.data;
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const e = data[i];
          const product = {
            id: e.id,
            name: e.name,
            price: e.price,
            description: e.description,
            image: e.image,
            stock: e.stock,
          };
          temp.push(product);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    products,
    rooms,
    addProduct,
    getProductList,
    getRooms,
    loading,
  };
};
