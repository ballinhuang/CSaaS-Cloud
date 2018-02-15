#ifndef NODE_HPP
#define NODE_HPP

#include <string>
using namespace std;

class Node {
    public:
        string getNodeName();
        int getNp();
        void setNp(int);
        int getOnp();

        friend class DLLScheHandler;

    private:
        Node(string, int, int);

        string name;
        int np;
        int onp;
};

#endif