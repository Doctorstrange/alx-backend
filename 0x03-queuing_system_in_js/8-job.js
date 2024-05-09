#!/usr/bin/yarn dev
import { Queue, Job } from 'kue';

class PushNotificationJob {
  constructor(jobInfo, queue) {
    this.jobInfo = jobInfo;
    this.queue = queue;
    this.job = null;
  }

  createJob() {
    this.job = this.queue.create('push_notification_code_3', this.jobInfo);
    this.job
      .on('enqueue', this.handleEnqueue.bind(this))
      .on('complete', this.handleComplete.bind(this))
      .on('failed', this.handleFailed.bind(this))
      .on('progress', this.handleProgress.bind(this));
    this.job.save();
  }

  handleEnqueue() {
    console.log('Notification job created:', this.job.id);
  }

  handleComplete() {
    console.log('Notification job', this.job.id, 'completed');
  }

  handleFailed(err) {
    console.log('Notification job', this.job.id, 'failed:', err.message || err.toString());
  }

  handleProgress(progress, _data) {
    console.log('Notification job', this.job.id, `${progress}% complete`);
  }
}

const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }
  for (const jobInfo of jobs) {
    const pushNotificationJob = new PushNotificationJob(jobInfo, queue);
    pushNotificationJob.createJob();
  }
};

export default createPushNotificationsJobs;