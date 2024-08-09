export default interface ICollectionFields {
    id: number | undefined;
    fieldName: string;
    fieldType: 'string' | 'number' | 'Date' | 'boolean';
}
