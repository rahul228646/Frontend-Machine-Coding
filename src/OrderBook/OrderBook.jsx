import React, { useEffect, useState } from "react";
import getMockData from "../utils/helper";

const freq = 2000;
const flashTimer = freq / 4;

const ProgressBar = (value = 0) => {
  return <div></div>;
};

const sortByKey = (arr, key, asc = true) => {
  return [...arr].sort((a, b) => {
    const valA = a[key],
      valB = b[key];
    return asc ? valA - valB : valB - valA;
  });
};

const OrderBook = () => {
  const [data, setData] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [sellList, setSellList] = useState([]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const resposne = getMockData();
      setBuyList((prev) => {
        const newData = {
          id: crypto.randomUUID(),
          buyQty: resposne.buyQty,
          buyBid: resposne.buyBid,
          updated: false,
        };
        const idx = prev.findIndex((item) => {
          return item.buyBid === newData.buyBid;
        });
        if (idx != -1) {
          const prevArray = [...prev];
          prevArray.updated = true;
          prevArray.buyBid += newData.buyBid;
        } else {
          const prevArray = [...prev, newData];
        }

        const sortedArray = sortByKey(prevArray, "buyBid", false);

        return sortedArray.map((item, index) => {
          return {
            ...item,
            updated: item.id !== prevArray[index].id ? true : false,
          };
        });
      });
      setSellList((prev) => {
        const prevArray = [
          ...prev,
          {
            id: crypto.randomUUID(),
            sellQty: resposne.sellQty,
            sellBid: resposne.sellBid,
            updated: false,
          },
        ];
        const sortedArray = sortByKey(prevArray, "sellBid", true);

        return sortedArray.map((item, index) => {
          return {
            ...item,
            updated: item.id !== prevArray[index].id ? true : false,
          };
        });
      });
    }, freq);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  console.log(buyList);

  return (
    <div
      style={{
        width: "40vw",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div></div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div>Buy</div>
          <div></div>
        </div>

        <div>
          <div>sell</div>
          <div></div>
        </div>
      </div>
      <div>
        <ProgressBar />
      </div>

      <div style={{ maxHeight: "50vh", overflow: "scroll" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "left",
          }}
        >
          <div style={{ width: "10vw" }}>QTY</div>
          <div style={{ width: "10vw" }}>BID</div>
          <div style={{ width: "10vw" }}>OFFER</div>
          <div style={{ width: "10vw" }}>QTY</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {buyList.map((item, index) => { 
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{ width: "10vw", color: index == 0 ? "green" : "" }}
                  >
                    {item.buyQty}
                  </div>
                  <div
                    style={{ width: "10vw", color: index == 0 ? "green" : "" }}
                  >
                    {item.buyBid}
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {sellList.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "10vw",
                      color: index == 0 ? "red" : "",
                    }}
                  >
                    {item.sellBid}
                  </div>
                  <div
                    style={{
                      width: "10vw",
                      color: index == 0 ? "red" : "",
                    }}
                  >
                    {item.sellQty}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
