import { ICollectionFields } from './collectionFields.interface';
import { IItems } from './items.interface';

export interface ICollection {
    id: number;
    title: string;
    description: string;
    theme: string;
    photoPath: string;
    creationDate: Date;
    userId: number;
    fields: ICollectionFields[];
    items: IItems[];
}
