exports.addressParser = function parseOrder(order) {
  const match = order.match(
    /order:\s(\w+\s\w+).*?address:\s(\w+\s\w+\s\w+).*?payment info:\s(\w+)/,
  );
  if (match) {
    return {
      order: match[1],
      address: match[2],
      payment: match[3],
    };
  }
  return null;
};
