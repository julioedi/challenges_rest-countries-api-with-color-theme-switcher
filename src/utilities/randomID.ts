function randomID (length:number = 10) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function randomIDMultiple(length:number  = 10,total:number = 4){
    return Array.from(Array(total).keys()).map(i => randomID()).join("-");
}

export {randomID};
export {randomIDMultiple}