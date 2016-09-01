<style lang="sass"></style>
<template>
  <div>
    {{ name }} component is ready for use!
  </div>
</template>
<script>
  /* ============
   * {{ name }} Component
   * ============
   *
   * todo: add documentation here!
   */

  export default {
    mounted() {
      console.log('{{ name }} component has been mounted!');
    },
  };
</script>
