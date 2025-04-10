export interface IResponseType<P = {}> {
    status?: number;
    isSuccess: boolean;
    message: string;
    data: P;
}