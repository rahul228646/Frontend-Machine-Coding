import React, { useEffect, useState } from "react";
import * as styles from "./Pagination.module.css";

const pageSize = 9;

const ProductCard = ({ product }) => {
  return (
    <div className={styles.productContainer}>
      <img src={product.images[0]} loading="lazy" />
      <div>{product.title}</div>
    </div>
  );
};

const PaginationTabs = ({ noOfPages, setCurrentPage }) => {
  return (
    <div className={styles.paginationContainer}>
      {Array.from({ length: noOfPages }).map((_, index) => {
        return <div onClick={() => setCurrentPage(index)}>{index + 1}</div>;
      })}
    </div>
  );
};

const Pagination = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const noOfPages = Math.ceil(products.length / pageSize);
  const start = currentPage * pageSize;
  const end = pageSize + start;
  const fetchData = async () => {
    const data = await fetch("https://dummyjson.com/products?limit=500");
    const response = await data.json();
    setProducts(response.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <PaginationTabs noOfPages={noOfPages} setCurrentPage={setCurrentPage} />
      <div className={styles.productArea}>
        {products.slice(start, end).map((product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
};

export default Pagination;
