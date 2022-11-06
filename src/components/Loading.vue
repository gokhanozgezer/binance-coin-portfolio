<template>
    <div class="loading-section" v-if="status">
        <circle10></circle10>
    </div>
</template>

<script>
import { Circle10 } from 'vue-loading-spinner';

export default {
    components: {
        Circle10
    },
    props:{
        status: {
            type: Boolean,
            default: () => false,
        },
    }
}
</script>