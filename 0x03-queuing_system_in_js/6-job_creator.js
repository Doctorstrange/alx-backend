#!/usr/bin/yarn dev
import { createQueue } from 'kue';

const in_line = createQueue({name: 'push_notification_code'});

const job = in_line.create('push_notification_code', {
  phoneNumber: '09099588144',
  message: 'Account Created',
});

job
  .on('enqueue', () => {
    console.log('Notification job created:', job.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed attempt', () => {
    console.log('Notification job failed');
  });
job.save();