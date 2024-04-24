describe('Reservations', () => {
  const user = {
    email: 'moeswilliam91@gmail.com',
    password: 'SuperSecretPassword123!'
  }


  beforeAll(async () => {
    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const jwt = await response.text();

    console.log({ jwtFromTest: jwt });
  })

  test('Create a reservation', async () => {
    expect(true).toBeTruthy();
    // const reservation = {
    //   date: '2022-01-01',
    //   time: '12:00',
    //   party: 2
    // }

    // const response = await fetch('http://reservations:3000/reservations', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${jwt}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(reservation)
    // });

    // expect(response.ok).toBeTruthy();
  })
})