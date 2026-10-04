class Node {
  constructor(value) {
    this.value = value;
    this.nextNode = null;
  }
}

class LinkedList {
  constructor() {
    this.listHead = null;
  }

  append(value) {
    const newNode = new Node(value);
    if (this.listHead === null) {
      this.listHead = newNode;
      return;
    }

    let current = this.listHead;
    while (current.nextNode !== null) {
      current = current.nextNode;
    }

    current.nextNode = newNode;
  }

  prepend(value) {
    const newNode = new Node(value);

    newNode.nextNode = this.listHead;
    this.listHead = newNode;
  }

  size() {
    let current = this.listHead;
    let count = 0;
    while (current !== null) {
      count++;
      current = current.nextNode;
    }

    return count;
  }

  head() {
    if (this.listHead === null) return undefined;

    return this.listHead.value;
  }

  tail() {
    if (this.listHead === null) return undefined;

    let current = this.listHead;
    while (current.nextNode !== null) {
      current = current.nextNode;
    }

    return current.value;
  }

  at(index) {
    if (index >= this.size() || index < 0) return undefined;
    let current = this.listHead;
    let i = 0;
    while (i < index) {
      i++;
      current = current.nextNode;
    }

    return current.value;
  }

  pop() {
    if (this.listHead === null) return undefined;

    const listHeadValue = this.listHead.value;
    this.listHead = this.listHead.nextNode;

    return listHeadValue;
  }

  contains(value) {
    let current = this.listHead;
    while (current !== null) {
      if (value === current.value) return true;
      current = current.nextNode;
    }

    return false;
  }

  findIndex(value) {
    const isPresent = this.contains(value);
    let current = this.listHead;
    let i = 0;

    if (!isPresent) return -1;

    while (current !== null) {
      if (value === current.value) {
        break;
      }
      i++;
      current = current.nextNode;
    }

    return i;
  }

  toString() {
    if (this.listHead === null) return "";

    let current = this.listHead;
    let string = `( ${this.listHead.value} ) -> `;
    while (current.nextNode !== null) {
      current = current.nextNode;
      string += `( ${current.value} ) -> `;
    }

    return string + "null";
  }

  insertAt(index, ...values) {
    if (index < 0 || index > this.size()) {
      throw new RangeError("Index out of range");
    }

    let prev = null;
    let current = this.listHead;

    for (let i = 0; i < index; i++) {
      prev = current;
      current = current.nextNode;
    }

    for (const value of values) {
      const newNode = new Node(value);
      newNode.nextNode = current;

      if (prev === null) {
        this.listHead = newNode;
      } else {
        prev.nextNode = newNode;
      }

      prev = newNode;
    }
  }

  removeAt(index) {
    if (index < 0 || index >= this.size())
      throw new RangeError("Index out of range");

    if (index === 0) {
      this.listHead = this.listHead.nextNode;
      return;
    }

    let prev = this.listHead;

    for (let i = 0; i < index - 1; i++) {
      prev = prev.nextNode;
    }

    prev.nextNode = prev.nextNode.nextNode;
  }
}

module.exports = LinkedList;
