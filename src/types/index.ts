export type Data<T,U> = {
    name:string,
    left : {name:T,value:number},
    right: {name:U,value:number}
} [];

export type DataWithRadius = {
    left: {name:string,value:number},
    right: {name:string,value:number},
    radius?:number
}[];
