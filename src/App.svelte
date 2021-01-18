<script lang="ts">
import RadialChart from './components/canvas/RadialChart.svelte';
import type { Data } from './types';
let data: Data<"spent", "estimate"> = [
        {
            name: "M1",
            left: { name: "spent", value: 3 },
            right: { name: "estimate", value: 2 },
        },
        {
            name: "M2",
            left: { name: "spent", value: 5 },
            right: { name: "estimate", value: 2 },
        },
        {
            name: "M3",
            left: { name: "spent", value: 3 },
            right: { name: "estimate", value: 5 },
        },
        {
            name: "M4",
            left: { name: "spent", value:2 },
            right: { name: "estimate", value: 1 },
        },
        {
            name: "M5",
            left: { name: "spent", value: 4 },
            right: { name: "estimate", value: 5 },
        },
    ];
</script>

<RadialChart {data} />
