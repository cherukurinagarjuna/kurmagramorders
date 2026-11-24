// GET /api/get-products
// Cloudflare Pages Function (Public)
import { json } from './_helpers.js';

const CATALOG_PRODUCTS = [
  { id: 'sunni', name: 'సున్నిపిండి', english_name: 'Sunni Pindi (Herbal Bath Powder)', price: 120, category: 'care', unit: '250g', min_qty: 1 },
  { id: 'anjan', name: 'గో అంజన్ భాం', english_name: 'Go Anjan Bham (Cow-Ghee Kajal)', price: 150, category: 'cow', unit: '10g', min_qty: 1 },
  { id: 'verm', name: 'వార్మ్ ఆర్క్', english_name: 'Verm Ark (Vermiwash Plant Tonic)', price: 90, category: 'farm', unit: '500ml', min_qty: 1 },
  { id: 'goark', name: 'గో ఆర్క్', english_name: 'Go Ark (Sacred Cow Distillate)', price: 140, category: 'cow', unit: '500ml', min_qty: 1 },
  { id: 'pain', name: 'పెయిన్ ఆయిల్', english_name: 'Herbal Pain Relief Oil', price: 180, category: 'care', unit: '100ml', min_qty: 1 },
  { id: 'rice', name: 'బ్రౌన్ రైస్', english_name: 'Brown Rice (Natural Farming)', price: 130, category: 'grain', unit: '1kg', min_qty: 1 },
  { id: 'sesame', name: 'నువ్వుల నూనె (గానుగ)', english_name: 'Cold-Pressed Sesame Oil', price: 220, category: 'oils', unit: '500ml', min_qty: 1 },
  { id: 'groundnut', name: 'పల్లి నూనె (గానుగ)', english_name: 'Cold-Pressed Groundnut Oil', price: 160, category: 'oils', unit: '500ml', min_qty: 1 }
];

export async function onRequestGet() {
  return json(200, {
    ok: true,
    products: CATALOG_PRODUCTS
  });
}
