describe('Reservations', () => {
  let jwt: string;
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

    jwt = await response.text();
  })

  test('Create and Get reservation', async () => {
    const createdReservation = await createReservation();
    const responseGet = await fetch(`http://reservations:3000/reservations/${createdReservation._id}`, {
      headers: {
        Authentication: `${jwt}`
      }
    });

    expect(responseGet.ok).toBeTruthy();
    const fetchedReservation = await responseGet.json();
    console.log({ createdReservation, fetchedReservation });
    expect(fetchedReservation).toEqual(createdReservation);
  })

  const createReservation = async () => {
    const responseCreate = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      headers: {
        Authentication: `${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: "04-02-2024",
        endDate: "05-02-2024",
        placeId: "123",
        charge: {
          amount: 57,
          card: {
            cvc: "413",
            exp_month: 12,
            exp_year: 2027,
            number: "4242 4242 4242 4242"
          }
        }
      })
    });

    expect(responseCreate.ok).toBeTruthy();
    return await responseCreate.json();
  }
})