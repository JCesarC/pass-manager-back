
export interface IDeleteUserUseCase {
  execute(id: string): Promise<any>
}
