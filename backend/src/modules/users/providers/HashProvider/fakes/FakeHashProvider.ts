import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  /**
   * generateHash
   */
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }
  /**
   * compareHash
   */

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
