const shipProto = {
  hit() {
    this.numOfHits++;
  },
  isSunk() {
    return this.numOfHits >= this.length;
  },
};

export function ship(length) {
  return {
    length,
    numOfHits: 0,
    ...shipProto,
  };
}
