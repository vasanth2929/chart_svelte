<script lang="ts">
    let width : number = 550;
    let height : number = 500 ;
    let yGap = 50;
    let data = [
        {
            name: 'Milestone 1',
        },
        {
            name: 'Milestone 2'
        },
        {
            name: 'Milestone 3'
        },
        {
            name: 'Milestone 4'
        },
    ];
    let yAxisValues = [50,100,150,200,250,300,350,400,450];
</script>

<div class="container">
    <svg {width} {height}>
        <!-- xaxis line -->
        <rect 
            width="100%" 
            height="3" 
            fill="grey"
            x="0" 
            y={height - yGap} />
        
        <!-- yaxis line -->
        <rect 
          y="0"
          x="0"
          width="3"
          fill="grey"
          height={height-yGap}
        />
    
        <!-- xaxis label -->
        {#each data as milestone,i }
          <text 
            x={i * 150 + 20}
            y={height-yGap+20}
            >
             {milestone.name}
            </text>
            <rect 
              x={i * 150 + 20}
              width="30"
              height="100"
              y={height-150}
              fill="red"
            />
            <rect 
              x={i * 150 + 20 +32}
              width="30"
              height="100"
              fill="green"
              y={height-150}
            />
        {/each}

        <!-- xaxis label -->
        {#each yAxisValues as label,i }
          <text 
            class="y-axis-value"
            x="0"
            y={height-yGap - i * 50}
            >
             {label}
            </text> 
        {/each}
        
    </svg>
</div>

<style>
    svg {
        overflow: visible;
    }
    text {
        font-size: 12px;
    }
    .container {
        display: flex;
        justify-content: center;
        margin-top: 50px;
    }
    .y-axis-value {
        transform: translateX(-25px);
    }
</style>