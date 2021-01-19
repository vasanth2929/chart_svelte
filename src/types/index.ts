export type Data<T,U> = {
    name:string,
    left : {name:T,value:number},
    right: {name:U,value:number}
} [];

export type Option = {
    width?: number;
    height?: number;
    data: any[];
    fontColor?: string;
    leftLabel?: string;
    rightLabel?: string;
    valueInticatorColor?: string;
    verticalLineColor?: string;
    rightArcColor?: string;
    leftArcColorOnFailure?: string;
    backgroundColor?: string;
}
