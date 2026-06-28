export interface IProductGallery {
    id: number;
    productId: number;
    imageUrl:string;
   isMain: boolean;
}

export interface IProductGalleryRequest {
    productId: number;
    imageUrl:string;
 

}
