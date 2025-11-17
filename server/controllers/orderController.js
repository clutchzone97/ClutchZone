import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) return res.status(400).json({ message: "Invalid id" });
  await Order.findByIdAndDelete(id);
  res.json({ message: "Deleted" });
};
