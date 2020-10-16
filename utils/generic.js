
export function convertListToObject(list) {
  let obj = {};
  list.forEach((element) => {
    obj[element.id] = element;
  });
  return obj;
}
