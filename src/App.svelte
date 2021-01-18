<script lang="ts">
    import Radial from "./components/canvas/R.svelte";
    import type { Data } from "./types";
    let data: Data<"spent", "estimate"> = [
        {
            name: "M1",
            left: { name: "spent", value: 4 },
            right: { name: "estimate", value: 5 },
        },
        {
            name: "M2",
            left: { name: "spent", value: 4 },
            right: { name: "estimate", value: 3 },
        },
        {
            name: "M3",
            left: { name: "spent", value: 5 },
            right: { name: "estimate", value: 8 },
        },
        {
            name: "M4",
            left: { name: "spent", value: 5 },
            right: { name: "estimate", value: 7 },
        },
        {
            name: "M5",
            left: { name: "spent", value: 8 },
            right: { name: "estimate", value: 5 },
        },
    ];
</script>

<Radial {data} />
