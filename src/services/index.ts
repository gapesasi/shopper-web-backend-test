export default interface IService<B, R> {
  execute(body: B): Promise<R>;
}