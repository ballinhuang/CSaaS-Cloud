#ifndef _ISCHEDULER
#define _ISCHEDULER

#include "Job.hpp"
#include "Node.hpp"
#include <deque>
using namespace std;

class IScheduler {
    public:
        virtual deque<Job> schedule(deque<Job>, deque<Job>, const long, deque<Node>) = 0;
};

extern "C" {
    IScheduler* getInstance();
}

#endif