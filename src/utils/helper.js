const getMockData = () => {
  const basePrice = 100;
  const baseQty = 1;
  const dataObject = {
    buyBid: Math.ceil(basePrice + Math.random() * 10),
    sellBid: Math.ceil(basePrice + Math.random() * 10),
    buyQty: Math.ceil(baseQty + Math.random() * 50),
    sellQty: Math.ceil(baseQty + Math.random() * 50),
  };
  return dataObject;
};

export default getMockData;
