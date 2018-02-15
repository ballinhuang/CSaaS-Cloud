#ifndef JOB_HPP
#define JOB_HPP

#include <string>
using namespace std;

enum Type {
    wait, run, scheduler
};

class Job {
    public:
        Job(long, int, string);
        long getId();
        long getSubmit();
        long getRun();
        long getWait();
        void setWait(long);
        long getEnd();
        int getNp();
        int getRequiredNode();
        string getNodeName();

        friend class DLLScheHandler;

    private:
        Job(long, long, long, int, int, Type);
        Job(long, long, long, int, string, Type);

        long id;
        long submitTime;
        long runTime;
        long waitTime;
        int np;
        int requiredNode;
        string nodeName;
        Type type;
};

#endif