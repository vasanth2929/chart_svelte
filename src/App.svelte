<script lang="ts">
import RadialChart from './components/canvas/RadialChart.svelte';
import type { Data } from './types';
let data: Data<"spent", "estimate"> = [
        {
            name: "M1",
            left: { name: "spent", value: 8 },
            right: { name: "estimate", value: 5 },
        },
        {
            name: "M2",
            left: { name: "spent", value: 5 },
            right: { name: "estimate", value: 7 },
        },
        {
            name: "M3",
            left: { name: "spent", value: 7 },
            right: { name: "estimate", value: 3 },
        },
    ];
</script>

<RadialChart {data} />
