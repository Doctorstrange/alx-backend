#!/usr/bin/yarn test
import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  let consoleSpy;
  let queue;

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');
    queue = createQueue({ name: 'push_notification_code_test' });
    queue.testMode.enter(true);
  });

  afterEach(() => {
    consoleSpy.restore();
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('throws an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type', async () => {
    const jobInfos = [
      { phoneNumber: '09099588144', message: 'Use the code 2245 to verify your account' },
      { phoneNumber: '09056688990', message: 'Use the code 2256 to verify your account' },
    ];
    createPushNotificationsJobs(jobInfos, queue);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(consoleSpy.calledWith('Notification job created:', queue.testMode.jobs[0].id)).to.be.true;
  });

  it('registers event handlers for job progress, failed, and complete', (done) => {
    const job = queue.createJob('push_notification_code_3', {});
    job.on('progress', () => {
      expect(consoleSpy.calledWith('Notification job', job.id, '25% complete')).to.be.true;
      done();
    });
    job.on('failed', () => {
      expect(consoleSpy.calledWith('Notification job', job.id, 'failed:', 'Failed to send')).to.be.true;
      done();
    });
    job.on('complete', () => {
      expect(consoleSpy.calledWith('Notification job', job.id, 'completed')).to.be.true;
      done();
    });
    job.save();
    setTimeout(() => job.emit('progress', 25), 50);
    setTimeout(() => job.emit('failed', new Error('Failed to send')), 100);
    setTimeout(() => job.emit('complete'), 150);
  });
});
