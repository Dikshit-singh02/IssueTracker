const Razorpay = require('razorpay');
const crypto = require('crypto');
const Complaint = require('../models/Complaint');

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, complaintId } = req.body;
    const order = await rzp.orders.create({
      amount: amount * 100, // paisa
      currency: 'INR',
      receipt: complaintId
    });
    res.json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, complaintId } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (expectedSign === razorpay_signature) {
      await Complaint.findOneAndUpdate({ complaintId }, { paymentId: razorpay_payment_id, status: 'InProgress' });
      res.json({ msg: 'Payment success', paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ msg: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
