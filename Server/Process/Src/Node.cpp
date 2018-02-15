#include "Node.hpp"

Node::Node(string name, int np, int onp) : name(name), np(np), onp(onp) {}

string Node::getNodeName() {
    return this->name;
}

int Node::getNp() {
    return this->np;
}

void Node::setNp(int n) {
    if(n > 0)
        this->np = n;

    this->np = 0;
}

int Node::getOnp() {
    return this->onp;
}
        