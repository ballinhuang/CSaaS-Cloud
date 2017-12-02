import kue from 'kue';

module.exports = class JobQueue {
  constructor() {
    this.registered = []
    this.queue = kue.createQueue()
    this.queue.setMaxListeners(20)
  }

  add(newjob, onComplete, onFailed) {
    const qJob = this.createJob(newjob)
    qJob.on('complete', onComplete)
    qJob.on('failed', onFailed)
  }

  register() {
    for (const JobClass of arguments) {
      this.registered.push(JobClass.name)
      this.queue.process(JobClass.name, 3, JobClass.onProcess)
    }
  }

  createJob(job) {
    return this.queue.create(
      job.constructor.name, job.getData()
    ).ttl(job.getTTL()).removeOnComplete(true).save()
  }

}
