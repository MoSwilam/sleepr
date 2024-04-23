import { ping } from 'tcp-ping';
// check the health of the reservation app
describe('HealthCheck', () => {
  // beforeEach(async () => {
  //   // Simple retry mechanism or delay
  //   await new Promise(resolve => setTimeout(resolve, 4000)); // wait 5 seconds before starting tests
  // });

  test('Reservations', async () => {
    const res = await fetch('http://reservations:3000')
    expect(res.ok).toBeTruthy()
  })

  test('Auth', async () => {
    const res = await fetch('http://auth:3001')
    expect(res.ok).toBeTruthy()
  })

  test('Payments', (done) => {
    ping({ address: 'pdayments', port: 3003}, (err) => {
      if (err) {
        fail(err);
      }
      done();
    })
  })

  test('Notifications', (done) => {
    ping({ address: 'notifications', port: 3004}, (err) => {
      if (err) {
        fail(err);
      }
      done();
    })
  })
})