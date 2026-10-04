const LinkedList = require("./linkedLists");

// Builds a list by appending each value in order.
const makeList = (...values) => {
  const list = new LinkedList();
  values.forEach((value) => list.append(value));
  return list;
};

// Walks the raw nodes and returns their values as an array.
// It has a safety cap so a broken (circular) list FAILS the test
// instead of freezing Jest forever.
const toArray = (list, cap = 1000) => {
  const values = [];
  let node = list.listHead;
  while (node !== null && node !== undefined) {
    if (values.length >= cap) {
      throw new Error(
        "List never ends: a node probably points back to an earlier node",
      );
    }
    values.push(node.value);
    node = node.nextNode;
  }
  return values;
};

describe("LinkedList", () => {
  describe("append()", () => {
    test("adds a node to an empty list", () => {
      const list = new LinkedList();
      list.append("a");
      expect(toArray(list)).toEqual(["a"]);
    });

    test("adds nodes to the end and keeps their order", () => {
      expect(toArray(makeList(1, 2, 3))).toEqual([1, 2, 3]);
    });

    test("handles many appends", () => {
      const list = new LinkedList();
      for (let i = 0; i < 500; i++) list.append(i);
      expect(list.size()).toBe(500);
      expect(list.head()).toBe(0);
      expect(list.tail()).toBe(499);
    });
  });

  describe("prepend()", () => {
    test("adds a node to an empty list", () => {
      const list = new LinkedList();
      list.prepend("a");
      expect(toArray(list)).toEqual(["a"]);
      expect(list.head()).toBe("a");
      expect(list.tail()).toBe("a");
    });

    test("adds a node to the start of the list", () => {
      const list = makeList(2, 3);
      list.prepend(1);
      expect(toArray(list)).toEqual([1, 2, 3]);
    });

    test("repeated prepends end up in reverse order", () => {
      const list = new LinkedList();
      list.prepend(1);
      list.prepend(2);
      list.prepend(3);
      expect(toArray(list)).toEqual([3, 2, 1]);
    });

    test("works together with append", () => {
      const list = makeList("b");
      list.prepend("a");
      list.append("c");
      expect(toArray(list)).toEqual(["a", "b", "c"]);
    });
  });

  describe("size()", () => {
    test("is 0 for a new list", () => {
      expect(new LinkedList().size()).toBe(0);
    });

    test("counts the nodes in the list", () => {
      expect(makeList("a", "b", "c").size()).toBe(3);
    });

    test("gives the same answer when called repeatedly", () => {
      const list = makeList("a", "b", "c");
      expect(list.size()).toBe(3);
      expect(list.size()).toBe(3);
      expect(list.size()).toBe(3);
    });

    test("stays correct as nodes are appended and prepended", () => {
      const list = new LinkedList();
      expect(list.size()).toBe(0);
      list.append("a");
      expect(list.size()).toBe(1);
      list.prepend("b");
      expect(list.size()).toBe(2);
      list.append("c");
      expect(list.size()).toBe(3);
    });
  });

  describe("head()", () => {
    test("returns undefined for an empty list", () => {
      expect(new LinkedList().head()).toBeUndefined();
    });

    test("returns the value of the first node", () => {
      expect(makeList("a", "b").head()).toBe("a");
    });

    test("changes after a prepend", () => {
      const list = makeList("b");
      list.prepend("a");
      expect(list.head()).toBe("a");
    });

    test("does not remove the node", () => {
      const list = makeList("a", "b");
      list.head();
      list.head();
      expect(toArray(list)).toEqual(["a", "b"]);
    });
  });

  describe("tail()", () => {
    test("returns undefined for an empty list", () => {
      expect(new LinkedList().tail()).toBeUndefined();
    });

    test("equals the head when there is one node", () => {
      const list = makeList("a");
      expect(list.tail()).toBe("a");
    });

    test("returns the value of the last node", () => {
      expect(makeList(1, 2, 3).tail()).toBe(3);
    });

    test("changes after an append but not after a prepend", () => {
      const list = makeList(1, 2);
      list.prepend(0);
      expect(list.tail()).toBe(2);
      list.append(3);
      expect(list.tail()).toBe(3);
    });
  });

  describe("at()", () => {
    test("returns the value at the first, middle and last index", () => {
      const list = makeList("a", "b", "c");
      expect(list.at(0)).toBe("a");
      expect(list.at(1)).toBe("b");
      expect(list.at(2)).toBe("c");
    });

    test("returns undefined when the index equals the size", () => {
      expect(makeList("a", "b", "c").at(3)).toBeUndefined();
    });

    test("returns undefined when the index is past the end", () => {
      expect(makeList("a", "b", "c").at(10)).toBeUndefined();
    });

    test("returns undefined for a negative index", () => {
      expect(makeList("a", "b", "c").at(-1)).toBeUndefined();
    });

    test("returns undefined for an empty list", () => {
      expect(new LinkedList().at(0)).toBeUndefined();
    });

    test("works without size() being called first", () => {
      const list = makeList("b", "c");
      list.prepend("a");
      expect(list.at(0)).toBe("a");
      expect(list.at(2)).toBe("c");
    });

    test("does not change the list", () => {
      const list = makeList("a", "b", "c");
      list.at(1);
      expect(toArray(list)).toEqual(["a", "b", "c"]);
    });
  });

  describe("pop()", () => {
    test("returns undefined for an empty list", () => {
      expect(new LinkedList().pop()).toBeUndefined();
    });

    test("returns the value of the head node", () => {
      expect(makeList("a", "b", "c").pop()).toBe("a");
    });

    test("removes the head node", () => {
      const list = makeList("a", "b", "c");
      list.pop();
      expect(toArray(list)).toEqual(["b", "c"]);
      expect(list.head()).toBe("b");
      expect(list.size()).toBe(2);
    });

    test("leaves an empty list when the only node is popped", () => {
      const list = makeList("a");
      expect(list.pop()).toBe("a");
      expect(toArray(list)).toEqual([]);
      expect(list.head()).toBeUndefined();
      expect(list.tail()).toBeUndefined();
      expect(list.size()).toBe(0);
      expect(list.toString()).toBe("");
    });

    test("successive pops return values in order, then undefined", () => {
      const list = makeList(1, 2, 3);
      expect(list.pop()).toBe(1);
      expect(list.pop()).toBe(2);
      expect(list.pop()).toBe(3);
      expect(list.pop()).toBeUndefined();
    });

    test("leaves a list that still works", () => {
      const list = makeList(1, 2);
      list.pop();
      list.append(3);
      expect(toArray(list)).toEqual([2, 3]);
    });
  });

  describe("contains()", () => {
    test.each(["a", "b", "c"])("returns true for %s", (value) => {
      expect(makeList("a", "b", "c").contains(value)).toBe(true);
    });

    test("returns false for a value that is not in the list", () => {
      expect(makeList("a", "b", "c").contains("z")).toBe(false);
    });

    test("returns false for an empty list", () => {
      expect(new LinkedList().contains("a")).toBe(false);
    });

    test("returns false for a value that was popped", () => {
      const list = makeList("a", "b");
      list.pop();
      expect(list.contains("a")).toBe(false);
      expect(list.contains("b")).toBe(true);
    });

    test("works with falsy values", () => {
      const list = makeList(0, false, "");
      expect(list.contains(0)).toBe(true);
      expect(list.contains(false)).toBe(true);
      expect(list.contains("")).toBe(true);
    });
  });

  describe("findIndex()", () => {
    test.each([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ])("returns the index of %s", (value, index) => {
      expect(makeList("a", "b", "c").findIndex(value)).toBe(index);
    });

    test("returns -1 for a value that is not in the list", () => {
      expect(makeList("a", "b", "c").findIndex("z")).toBe(-1);
    });

    test("returns -1 for an empty list", () => {
      expect(new LinkedList().findIndex("a")).toBe(-1);
    });

    test("returns the first index when there are duplicates", () => {
      expect(makeList("x", "a", "b", "a").findIndex("a")).toBe(1);
    });

    test("agrees with at()", () => {
      const list = makeList("w", "x", "y", "z");
      for (let i = 0; i < 4; i++) {
        expect(list.findIndex(list.at(i))).toBe(i);
      }
    });

    test("does not change the list", () => {
      const list = makeList("a", "b", "c");
      list.findIndex("b");
      expect(toArray(list)).toEqual(["a", "b", "c"]);
    });
  });

  describe("toString()", () => {
    test("returns an empty string for an empty list", () => {
      expect(new LinkedList().toString()).toBe("");
    });

    test("formats a single node", () => {
      expect(makeList("a").toString()).toBe("( a ) -> null");
    });

    test("formats several nodes", () => {
      expect(makeList(1, 2, 3).toString()).toBe(
        "( 1 ) -> ( 2 ) -> ( 3 ) -> null",
      );
    });

    test("matches the format from the assignment", () => {
      const list = makeList(
        "dog",
        "cat",
        "parrot",
        "hamster",
        "snake",
        "turtle",
      );
      expect(list.toString()).toBe(
        "( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null",
      );
    });

    test("does not change the list", () => {
      const list = makeList("a", "b");
      const first = list.toString();
      expect(list.toString()).toBe(first);
      expect(list.size()).toBe(2);
    });

    test("reflects later changes", () => {
      const list = makeList("b", "c");
      list.prepend("a");
      expect(list.toString()).toBe("( a ) -> ( b ) -> ( c ) -> null");
      list.pop();
      expect(list.toString()).toBe("( b ) -> ( c ) -> null");
    });
  });

  describe("insertAt()", () => {
    test("inserts one value in the middle", () => {
      const list = makeList(1, 2, 3);
      list.insertAt(1, 10);
      expect(toArray(list)).toEqual([1, 10, 2, 3]);
    });

    test("inserts several values in order (assignment example)", () => {
      const list = makeList(1, 2, 3);
      list.insertAt(1, 10, 11);
      expect(list.toString()).toBe(
        "( 1 ) -> ( 10 ) -> ( 11 ) -> ( 2 ) -> ( 3 ) -> null",
      );
    });

    test("inserting at index 0 makes the new node the head", () => {
      const list = makeList("c");
      list.insertAt(0, "a", "b");
      expect(toArray(list)).toEqual(["a", "b", "c"]);
      expect(list.head()).toBe("a");
    });

    test("inserting at index === size adds to the end", () => {
      const list = makeList(1, 2, 3);
      list.insertAt(3, 4, 5);
      expect(toArray(list)).toEqual([1, 2, 3, 4, 5]);
      expect(list.tail()).toBe(5);
    });

    test("inserts just before the last node", () => {
      const list = makeList(1, 2, 3);
      list.insertAt(2, "x");
      expect(toArray(list)).toEqual([1, 2, "x", 3]);
    });

    test("works on an empty list at index 0", () => {
      const list = new LinkedList();
      list.insertAt(0, "a", "b");
      expect(toArray(list)).toEqual(["a", "b"]);
      expect(list.size()).toBe(2);
    });

    test("increases the size by the number of values inserted", () => {
      const list = makeList(1, 2, 3);
      list.insertAt(1, 10, 11);
      expect(list.size()).toBe(5);
    });

    test("keeps at(), findIndex() and tail() correct afterwards", () => {
      const list = makeList(1, 2, 3);
      list.insertAt(1, 10, 11);
      expect(list.at(1)).toBe(10);
      expect(list.at(2)).toBe(11);
      expect(list.findIndex(2)).toBe(3);
      expect(list.tail()).toBe(3);
    });

    test("uses the real size for its bounds, even after size() calls", () => {
      const list = makeList(1, 2, 3);
      list.size();
      list.size();
      list.insertAt(3, 4);
      expect(toArray(list)).toEqual([1, 2, 3, 4]);
      expect(() => list.insertAt(5, "x")).toThrow(RangeError);
    });

    test("throws a RangeError for a negative index", () => {
      expect(() => makeList(1, 2, 3).insertAt(-1, "x")).toThrow(RangeError);
    });

    test("throws a RangeError when the index is above the size", () => {
      expect(() => makeList(1, 2, 3).insertAt(4, "x")).toThrow(RangeError);
    });

    test("throws a RangeError on an empty list for index 1", () => {
      expect(() => new LinkedList().insertAt(1, "x")).toThrow(RangeError);
    });

    test("leaves the list unchanged when it throws", () => {
      const list = makeList(1, 2, 3);
      expect(() => list.insertAt(10, "x")).toThrow(RangeError);
      expect(toArray(list)).toEqual([1, 2, 3]);
    });
  });

  describe("removeAt()", () => {
    test("removes the head (index 0) and keeps the rest", () => {
      const list = makeList("a", "b", "c");
      list.removeAt(0);
      expect(toArray(list)).toEqual(["b", "c"]);
      expect(list.head()).toBe("b");
      expect(list.size()).toBe(2);
    });

    test("removes a node from the middle", () => {
      const list = makeList("a", "b", "c");
      list.removeAt(1);
      expect(toArray(list)).toEqual(["a", "c"]);
    });

    test("removes the last node", () => {
      const list = makeList("a", "b", "c");
      list.removeAt(2);
      expect(toArray(list)).toEqual(["a", "b"]);
      expect(list.tail()).toBe("b");
    });

    test("leaves an empty list when the only node is removed", () => {
      const list = makeList("a");
      list.removeAt(0);
      expect(toArray(list)).toEqual([]);
      expect(list.head()).toBeUndefined();
      expect(list.size()).toBe(0);
      expect(list.toString()).toBe("");
    });

    test("shifts the indexes of later nodes", () => {
      const list = makeList("a", "b", "c", "d");
      list.removeAt(1);
      expect(list.at(1)).toBe("c");
      expect(list.findIndex("b")).toBe(-1);
      expect(list.contains("b")).toBe(false);
    });

    test("can remove the head repeatedly until the list is empty", () => {
      const list = makeList(1, 2, 3);
      list.removeAt(0);
      list.removeAt(0);
      list.removeAt(0);
      expect(toArray(list)).toEqual([]);
      expect(list.size()).toBe(0);
    });

    test("allows appending after the last node was removed", () => {
      const list = makeList(1, 2, 3);
      list.removeAt(2);
      list.append(9);
      expect(toArray(list)).toEqual([1, 2, 9]);
    });

    test("throws a RangeError for a negative index", () => {
      expect(() => makeList(1, 2, 3).removeAt(-1)).toThrow(RangeError);
    });

    test("throws a RangeError when the index equals the size", () => {
      expect(() => makeList(1, 2, 3).removeAt(3)).toThrow(RangeError);
    });

    test("throws a RangeError when the index is above the size", () => {
      expect(() => makeList(1, 2, 3).removeAt(10)).toThrow(RangeError);
    });

    test("throws a RangeError on an empty list", () => {
      expect(() => new LinkedList().removeAt(0)).toThrow(RangeError);
    });

    test("leaves the list unchanged when it throws", () => {
      const list = makeList(1, 2, 3);
      expect(() => list.removeAt(3)).toThrow(RangeError);
      expect(toArray(list)).toEqual([1, 2, 3]);
    });
  });

  describe("combined scenario (from the assignment's test script)", () => {
    test("append, prepend, removeAt, insertAt and pop work together", () => {
      const list = new LinkedList();
      ["dog", "cat", "parrot", "hamster", "snake", "turtle"].forEach((pet) =>
        list.append(pet),
      );
      list.prepend("monkey");
      expect(list.toString()).toBe(
        "( monkey ) -> ( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null",
      );

      list.removeAt(0);
      expect(list.head()).toBe("dog");

      list.insertAt(2, "fish", "bird");
      expect(toArray(list)).toEqual([
        "dog",
        "cat",
        "fish",
        "bird",
        "parrot",
        "hamster",
        "snake",
        "turtle",
      ]);

      expect(list.pop()).toBe("dog");
      expect(list.size()).toBe(7);
      expect(list.at(1)).toBe("fish");
      expect(list.findIndex("parrot")).toBe(3);
      expect(list.tail()).toBe("turtle");
    });
  });
});
