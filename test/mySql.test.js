import MySqlService from '../src/services/mySql';

describe('Connection', () => {
  let service;
  beforeAll(async () => {
    service = new MySqlService(global.importClient, 'test');
  });

  test('Insert One', async () => {
    const data = await service.insertOne([{ name: 'test', surname: 'test' }]);
    const { warningCount, affectedRows } = data;
    expect(warningCount).toEqual(0);
    expect(affectedRows).toEqual(1);
  });

  test('Insert many', async () => {
    const mockData = [
      { name: 'test', surname: 'test' },
      { name: 'test', surname: 'test' },
      { name: 'test', surname: 'test' },
    ];
    const data = await service.insertMany(mockData);
    const { warningCount, affectedRows } = data;
    expect(warningCount).toEqual(0);
    expect(affectedRows).toEqual(mockData.length);
  });
});
