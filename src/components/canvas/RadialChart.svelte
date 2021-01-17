<script lang="ts">
    import {
        degreesToRadians,
        findMinAndMax,
        getNumbers,
        findXPosition,
    } from "../../utils";

    interface Option {
        width?: number;
        height?: number;
        data: any;
        fontColor?: string;
        leftLabel?: string;
        rightLabel?: string;
        valueInticatorColor?: string;
        verticalLineColor?: string;
        rightArcColor?: string;
        leftArcColorOnFailure?: string;
    }
    export let data = [];
    let { max, min } = findMinAndMax(data);

    function chart(ele: HTMLElement, options: Option) {
        let canvas = document.createElement("canvas");
        let startRadius = 150;
        let radiusGap = 30;
        let indexOf;
        let { data } = options;
        let width = options.width || 500;
        let height = options.height || 500;
        canvas.width = width;
        canvas.height = height;
        canvas.setAttribute("style", `border:2px dashed green`);

        let ctx = canvas.getContext("2d");

        // right text
        let numbers = getNumbers(min, max);
        let revArr = [...numbers];
        numbers.reverse();

        for (let i = 0; i < numbers.length; i++) {
            // right text
            ctx.beginPath();
            ctx.fillStyle = options.fontColor;
            ctx.fillText(
                numbers[i].toString(),
                findXPosition(width, 180, (90 / numbers.length) * i) +
                    (i < 1 ? 6 : i * 8),
                height / 2 - i * 35
            );
            ctx.closePath();

            // left text
            ctx.beginPath();
            ctx.fillStyle = options.fontColor;
            ctx.fillText(
                numbers[i].toString(),
                findXPosition(
                    width,
                    180,
                    360 - 180 - (90 / numbers.length) * i
                ) -
                    (i < 1 ? 6 : i * 8) -
                    5,
                height / 2 - i * 35
            );
            ctx.closePath();
        }

        // arc
        for (let i = 0; i < data.length; i++) {
            // right arc
            ctx.beginPath();
            ctx.strokeStyle = options.rightArcColor || "black";
            ctx.lineWidth = 30;
            indexOf = revArr.indexOf(data[i].right.value) + 1;
            ctx.arc(
                width / 2,
                height / 2,
                startRadius - i * radiusGap,
                degreesToRadians(
                    360 -
                        (indexOf === numbers.length
                            ? 0
                            : indexOf === 1
                            ? 90 - 90 / numbers.length
                            : 90 / indexOf)
                ),
                degreesToRadians(270),
                true
            );
            ctx.stroke();
            ctx.closePath();

            // left arc
            ctx.beginPath();
            ctx.strokeStyle =
                data[i].left.value <= data[i].right.value
                    ? options.rightArcColor || "black"
                    : options.leftArcColorOnFailure || "black";
            ctx.lineWidth = 30;
            indexOf = revArr.indexOf(data[i].left.value) || 1;
            ctx.arc(
                width / 2,
                height / 2,
                startRadius - i * radiusGap,
                degreesToRadians(270),
                degreesToRadians(
                    270 -
                        (indexOf === numbers.length
                            ? 0
                            : indexOf === 1
                            ? 90 - 90 / numbers.length
                            : 90 / indexOf)
                ),
                true
            );
            ctx.stroke();
            ctx.closePath();
        }

        // indicator
        ctx.beginPath();
        ctx.strokeStyle = options.valueInticatorColor || "orange";
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

        // vertical line
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.strokeStyle = options.verticalLineColor || "black";
        ctx.lineWidth = 3;
        ctx.lineTo(width / 2, height / 2 - startRadius - 15);
        ctx.stroke();

        // left side label
        ctx.font = "14px Arial";
        ctx.fillText(options.leftLabel, width / 2 - 180 - 40, height / 2 + 40);
        ctx.closePath();

        // right side label
        ctx.font = "14px Arial";
        ctx.fillText(options.rightLabel, width / 2 + 180 - 40, height / 2 + 40);
        ctx.closePath();

        // appending canvas to the div
        ele.appendChild(canvas);
    }
</script>

<div
    use:chart={{ data, leftLabel: 'Spent Time', rightLabel: 'Estimate Time', rightArcColor: 'palegreen', leftArcColorOnFailure: 'palevioletred' }} />
