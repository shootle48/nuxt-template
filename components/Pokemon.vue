<template>
    <div v-for="pokemon in pokemons">
        {{ pokemon.name }}
    </div>
</template>

<script setup>
const PokemonStore = usePokemons()
const pokemons = PokemonStore.pokemons

onMounted(async () => {
    await PokemonStore.fetchPokemons()
})
</script>

<style lang="scss" scoped></style>