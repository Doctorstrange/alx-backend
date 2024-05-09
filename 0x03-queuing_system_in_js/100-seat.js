const express = require('express');
const redis = require('redis');
const kue = require('kue');

const server = express();
const seatStore = redis.createClient({ name: 'reserve_seat' });
const reservationQueue = kue.createQueue();
const TOTAL_SEATS = 50;
let canReserve = false;

const PORT = 1245;

/**
 * Modifies the number of available seats.
 */

const reserveSeat = async (number) => {
  return await seatStore.set('available_seats', number);
};

/**
 * Retrieves the number of available seats.
 */

const getCurrentAvailableSeats = async () => {
  return await seatStore.get('available_seats');
};

server.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats()
    .then((numberOfAvailableSeats) => {
      res.json({ numberOfAvailableSeats });
    });
});

server.get('/reserve_seat', (_req, res) => {
  if (!canReserve) {
    res.json({ status: 'Reservations are blocked' });
    return;
  }
  try {
    const reservationJob = reservationQueue.create('reserve_seat');

    reservationJob.on('failed', (err) => {
      console.log(
        'Seat reservation job',
        reservationJob.id,
        'failed:',
        err.message || err.toString()
      );
    });

    reservationJob.on('complete', () => {
      console.log('Seat reservation job', reservationJob.id, 'completed');
    });

    reservationJob.save();
    res.json({ status: 'Reservation in process' });
  } catch {
    res.json({ status: 'Reservation failed' });
  }
});

server.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });
  reservationQueue.process('reserve_seat', (_job, done) => {
    getCurrentAvailableSeats()
      .then((result) => Number.parseInt(result || 0))
      .then((availableSeats) => {
        canReserve = availableSeats <= 1 ? false : canReserve;
        if (availableSeats >= 1) {
          reserveSeat(availableSeats - 1)
            .then(() => done());
        } else {
          done(new Error('Not enough seats available'));
        }
      });
  });
});

const resetAvailableSeats = async (initialSeatsCount) => {
  return await seatStore.set('available_seats', Number.parseInt(initialSeatsCount));
};

server.listen(PORT, async () => {
  await resetAvailableSeats(process.env.INITIAL_SEATS_COUNT || TOTAL_SEATS);
  canReserve = true;
  console.log(`API available on localhost port ${PORT}`);
});

module.exports = server;
