INSERT OR REPLACE INTO orders (
  order_no, order_code, customer_name, customer_phone, customer_address,
  product_details, amount, total_amount, items, payment_ref, status, transporter
) VALUES (
  'KG-20261124-7654',
  'KG-20261124-7654',
  'Cherukuri Nagarjun',
  '+918074724717',
  'Perisepalli Village, Pamarru Mandal, Krishna District, Andhra Pradesh - 521157',
  'బ్రౌన్ రైస్ x 1 (25kg)',
  3000,
  3000,
  '[{"name":"బ్రౌన్ రైస్ (Brown Rice)","quantity":1,"price":3000,"unit":"25kg","subtotal":3000}]',
  'Screenshot on WhatsApp',
  'received',
  'Navata Road Transport'
);
