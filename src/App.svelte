<script lang="ts">
    import Radial from "./components/canvas/R.svelte";
    import type { Data } from "./types";
    let data: Data<"spent", "estimate"> = [
        {
            name: "M1",
            left: { name: "spent", value: 1 },
            right: { name: "estimate", value: 5 },
        },
        {
            name: "M2",
            left: { name: "spent", value: 2 },
            right: { name: "estimate", value: 3 },
        },
        {
            name: "M3",
            left: { name: "spent", value: 4 },
            right: { name: "estimate", value: 2 },
        },
        {
            name: "M4",
            left: { name: "spent", value: 5 },
            right: { name: "estimate", value: 1 },
        },
        {
            name: "M5",
            left: { name: "spent", value: 2 },
            right: { name: "estimate", value: 2 },
        },
    ];
</script>

<Radial {data} />
