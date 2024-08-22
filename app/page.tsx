"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [idProduct, setIdProduct] = useState<number>();
  const [newProduct, setNewProduct] = useState({
    id: "",
    productName: "",
    price: "",
    image: "",
    quantity: "",
  });
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    axios
      .get("http://localhost:3000/api")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((product) => ({
      ...product,
      [name]: value,
    }));
  };

  const checkDuplicateName = async (productName: string) => {
    try {
      const res = await axios.get("http://localhost:3000/api");
      const products = res.data;
      return products.some(
        (product: any) =>
          product.productName.toLowerCase() === productName.toLowerCase()
      );
    } catch (error) {
      console.error("Lỗi khi kiểm tra tên trùng lặp:", error);
      return false;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(Number(newProduct.price)) || Number(newProduct.price) <= 0) {
      Swal.fire({
        title: "Lỗi!",
        text: "Giá sản phẩm phải là một số dương.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const isDuplicate = await checkDuplicateName(newProduct.productName);
    if (isDuplicate && status === false) {
      Swal.fire({
        title: "Lỗi!",
        text: "Tên sản phẩm đã tồn tại.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      isNaN(Number(newProduct.quantity)) ||
      Number(newProduct.quantity) <= 0
    ) {
      Swal.fire({
        title: "Lỗi!",
        text: "Số lượng sản phẩm phải là một số không âm.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!/^https?:\/\/[^\s]+$/.test(newProduct.image)) {
      Swal.fire({
        title: "Lỗi!",
        text: "URL hình ảnh không hợp lệ.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (status === false) {
      try {
        await axios.post("http://localhost:3000/api", newProduct);
        const res = await axios.get("http://localhost:3000/api");
        setProducts(res.data);
        setNewProduct({
          id: "",
          productName: "",
          price: "",
          image: "",
          quantity: "",
        });
        setStatus(false);
        Swal.fire({
          title: "Thành công!",
          text: "Sản phẩm đã được thêm.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi thêm sản phẩm.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      try {
        await axios.put(`http://localhost:3000/api/${idProduct}`, newProduct);
        const res = await axios.get("http://localhost:3000/api");
        setProducts(res.data);
        setNewProduct({
          id: "",
          productName: "",
          price: "",
          image: "",
          quantity: "",
        });
        setStatus(false);
        Swal.fire({
          title: "Thành công!",
          text: "Sản phẩm đã được cập nhật.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi cập nhật sản phẩm.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/${id}`);
        const res = await axios.get("http://localhost:3000/api");
        setProducts(res.data);
        Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Lỗi!", "Đã xảy ra lỗi khi xóa sản phẩm.", "error");
      }
    }
  };
  const handleChangeInfor = async (id: number) => {
    try {
      setIdProduct(id);
      setStatus(true);
      const res = await axios.get("http://localhost:3000/api");
      const products = res.data;
      const find = products.find((product: any) => product.id === id);
      if (find) {
        setNewProduct(find);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api");
      const data = res.data;
      const searchTerm = search.toLowerCase();
      const filteredProducts = data.filter((product: any) =>
        product.productName.toLowerCase().includes(searchTerm)
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  return (
    <>
      <br />
      <div className="flex items-center justify-center mb-4">
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="border border-gray-300 rounded-md py-2 px-4 w-full max-w-xs text-sm mr-2"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">STT</th>
              <th className="py-3 px-6 text-left">Tên sản phẩm</th>
              <th className="py-3 px-6 text-left">Hình ảnh</th>
              <th className="py-3 px-6 text-left">Giá</th>
              <th className="py-3 px-6 text-left">Số lượng</th>
              <th className="py-3 px-6 text-left">Chức năng</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{index + 1}</td>
                  <td className="py-3 px-6 text-left">{product.productName}</td>
                  <td className="py-3 px-6 text-left">
                    <Image
                      src={product.image}
                      alt={product.productName}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-3 px-6 text-left">{product.quantity}</td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => handleChangeInfor(product.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700"
            >
              ID
            </label>
            <input
              name="id"
              onChange={handleChange}
              type="text"
              id="productId"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={status ? newProduct.id : products.length + 1}
            />
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Tên sản phẩm
            </label>
            <input
              name="productName"
              onChange={handleChange}
              type="text"
              id="productName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập tên sản phẩm"
              value={newProduct.productName}
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Giá sản phẩm
            </label>
            <input
              type="text"
              onChange={handleChange}
              name="price"
              id="price"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập giá sản phẩm"
              value={newProduct.price}
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Hình ảnh sản phẩm
            </label>
            <input
              type="url"
              name="image"
              onChange={handleChange}
              id="image"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập URL hình ảnh"
              value={newProduct.image}
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Số lượng
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập số lượng sản phẩm"
              value={newProduct.quantity}
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {status ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </button>
        </form>
      </div>
    </>
  );
}
