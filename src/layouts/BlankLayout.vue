<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
        <q-page>
                <slot name="page"></slot>
        </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>