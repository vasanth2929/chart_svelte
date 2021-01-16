<script lang="ts">
    import type { Data } from "../../types";
    import { degreesToRadians, findMinAndMax, getNumbers } from "../../utils";

    interface Option {
        width?: number;
        height?: number;
        data?: any;
    }
    let data: Data<"spent", "estimate"> = [
        {
            name: "M1",
            left: { name: "spent", value: 3 },
            right: { name: "estimate", value: 6 },
        },
        {
            name: "M2",
            left: { name: "spent", value: 5 },
            right: { name: "estimate", value: 8 },
        },
        {
            name: "M3",
            left: { name: "spent", value: 4 },
            right: { name: "estimate", value: 6 },
        },
    ];
    let { max, min } = findMinAndMax(data);

    function chart(
        ele: HTMLCanvasElement,
        options: Option = { width: 500, height: 400, data }
    ) {
        let startRadius = 150;
        let radiusGap = 30;
        let colors = ["purple", "red", "green"];

        let { width, height, data } = options;
        ele.width = width;
        ele.height = height;
        ele.setAttribute("style", `border:2px dashed green`);

        let ctx = ele.getContext("2d");

        // arc
        for (let i = 0; i < data.length; i++) {
            ctx.beginPath();
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = 20;
            ctx.arc(
                width / 2,
                height / 2,
                startRadius - i * radiusGap,
                degreesToRadians(0),
                degreesToRadians(180),
                true
            );
            ctx.stroke();
            ctx.closePath();
        }
        
        // orange indicator
        ctx.beginPath();
        ctx.strokeStyle="orange";
        ctx.lineWidth = 2;
        ctx.arc(width/2,height/2,180,degreesToRadians(360),degreesToRadians(180),true);
        ctx.stroke();
        ctx.closePath();

        // black vertical line
        ctx.beginPath();
        ctx.moveTo(width/2,height/2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.lineTo(width/2,height/2 - startRadius - 20/2);
        ctx.stroke();

        // left side label
        ctx.font = "14px Arial"
        ctx.fillText('Spent Time',width/2 - 180 - 40,height/2 + 40);
        ctx.closePath();

        // right side label
        ctx.font = "14px Arial"
        ctx.fillText('Estimate Time',width/2 + 180 - 40,height/2 + 40);
        ctx.closePath();
    }
</script>

<canvas use:chart />
