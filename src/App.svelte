<script lang="ts">
	import RadialChart from "./components/RadialChart.svelte";
	import type { Data } from "./types";
	let data: Data<"spent", "estimate"> = [
		{
			name: 'M1',
			left: { name: "spent", value: 3 },
			right: { name: "estimate", value: 5 },
		},
		{   
			name: 'M2',
			left: { name: "spent", value: 6 },
			right: { name: "estimate", value: 3 },
		},
		{
			name: 'M3',
			left: { name: "spent", value: 3 },
			right: { name: "estimate", value: 8 },
		},
	];
</script>

<RadialChart {data} />
