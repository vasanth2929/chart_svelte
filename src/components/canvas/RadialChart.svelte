<script lang="ts">
    import type { Data } from "../../types";
    import { degreesToRadians, findMinAndMax, getNumbers,findXPosition } from "../../utils";

    interface Option {
        width?: number;
        height?: number;
        data?: any;
    }
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
            left: { name: "spent", value: 3 },
            right: { name: "estimate", value: 3 },
        }
    ];
    let { max, min } = findMinAndMax(data);

    function chart(
        ele: HTMLCanvasElement,
        options: Option = { width: 500, height: 400, data }
    ) {
        let startRadius = 150;
        let radiusGap = 30;
        let indexOf;

        let { width, height, data } = options;
        ele.width = width;
        ele.height = height;
        ele.setAttribute("style", `border:2px dashed green`);

        let ctx = ele.getContext("2d");
        
        // right text 
        let numbers = getNumbers(min,max);
        let revArr = [...numbers];
        numbers.reverse();

        for(let i = 0; i < numbers.length; i++) {
            // right text
            ctx.beginPath();            
            ctx.fillText(
                numbers[i].toString(),
                findXPosition(width,180,90/numbers.length * i) + (i < 1 ? 6 : i*8) ,
                height/2 - i * 35
                );
            ctx.closePath();
            
            // left text
            ctx.beginPath();
            ctx.fillText(
                numbers[i].toString(),
                findXPosition(width,180,360 - 180 - (90 / numbers.length) * i) - (i < 1 ? 6 : i*8) -5 ,
                height/2 - i * 35
                );
            ctx.closePath();
        }

        // arc
        for (let i = 0; i < data.length; i++) {
            // right arc
            ctx.beginPath();
            ctx.strokeStyle = "palegreen";
            ctx.lineWidth = 30;
            indexOf = revArr.indexOf(data[i].right.value) + 1 ;
            ctx.arc(
                width / 2,
                height / 2,
                startRadius - i * radiusGap,
                degreesToRadians(360 - (indexOf === numbers.length ? 0: indexOf === 1 ? 90 - 90/numbers.length :90/indexOf) ),
                degreesToRadians(270),
                true
            );
            ctx.stroke();
            ctx.closePath();

            // left arc
            // ctx.beginPath();
            // ctx.strokeStyle = data[i].left.value <= data[i].right.value ? 'palegreen': 'red';
            // ctx.lineWidth = 30;
            // indexOf = revArr.indexOf(data[i].left.value) || 1;
            // ctx.arc(
            //     width / 2,
            //     height / 2,
            //     startRadius - i * radiusGap,
            //     degreesToRadians(270),
            //     degreesToRadians(270 - (indexOf === 1 ? 90/numbers.length : 90 / indexOf)),
            //     true
            // );
            // ctx.stroke();
            // ctx.closePath();
        }

        // orange indicator
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.arc(
            width / 2,
            height / 2,
            180,
            degreesToRadians(360),
            degreesToRadians(180),
            true
        );
        ctx.stroke();
        ctx.closePath();

        // black vertical line
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.lineTo(width / 2, height / 2 - startRadius - 15);
        ctx.stroke();

        // left side label
        ctx.font = "14px Arial";
        ctx.fillText("Spent Time", width / 2 - 180 - 40, height / 2 + 40);
        ctx.closePath();

        // right side label
        ctx.font = "14px Arial";
        ctx.fillText("Estimate Time", width / 2 + 180 - 40, height / 2 + 40);
        ctx.closePath();
    }
</script>

<canvas use:chart />
