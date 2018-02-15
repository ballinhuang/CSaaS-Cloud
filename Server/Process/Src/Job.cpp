#include "Job.hpp"

Job::Job(long id, long submit, long run, int np, int reqNode, Type t) : id(id), submitTime(submit), runTime(run), np(np), requiredNode(reqNode), type(t) {}

Job::Job(long id, long submit, long run, int np, string name, Type t) : id(id), submitTime(submit), runTime(run), np(np), nodeName(name), type(t) {}

Job::Job(long id, int np, string name) : id(id), np(np), nodeName(name), type(scheduler) {}

long Job::getId() {
    return this->id;
}

long Job::getSubmit() {
    return this->submitTime;
}
long Job::getRun() {
    return this->runTime;
}

long Job::getWait() {
    return this->waitTime;
}

void Job::setWait(long w) {
    if(w > 0)
        this->waitTime = w;

    this->waitTime = 0;
}

long Job::getEnd() {
    if(this->type == run)
        return this->submitTime + this->waitTime + this->runTime;

    return -1;
}

int Job::getNp() {
    return this->np;
}

int Job::getRequiredNode() {
    return this->requiredNode;
}

string Job::getNodeName() {
    if(this->type == wait)
        return NULL;

    return this->nodeName;
}