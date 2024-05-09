#!/usr/bin/yarn dev
import { createQueue, Job } from 'kue';

const BLACKLISTED_NUMBERS = ['4153518780', '4153518781'];
const serve = createQueue();

/**
 * Sends notification to user.
 */

const sendNotification = (phoneNumber, message, job, done) => {
  let sum = 2, pending = 2;
  let timetosend = setInterval(() => {
    if (sum - pending <= sum / 2) {
      job.progress(sum - pending, sum);
    }
    if (BLACKLISTED_NUMBERS.includes(phoneNumber)) {
      done(new Error(`Phone number ${phoneNumber} is blacklisted`));
      clearInterval(timetosend);
      return;
    }
    if (sum === pending) {
      console.log(
        `Sending notification to ${phoneNumber},`,
        `with message: ${message}`,
      );
    }
    --pending || done();
    pending || clearInterval(timetosend);
  }, 1000);
};

serve.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});