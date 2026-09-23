// Static database of Indian trains for fast search and reliable tracking fallback.

export interface TrainEntry {
  number: string;
  name: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
}

export const TRAINS_DB: TrainEntry[] = [
  // SECR / Raipur / Chhattisgarh MEMU & Passenger Trains
  { number: '68728', name: 'Raipur - Bilaspur MEMU', from: 'Raipur Junction', fromCode: 'R', to: 'Bilaspur Junction', toCode: 'BSP' },
  { number: '08728', name: 'Raipur - Bilaspur MEMU Special', from: 'Raipur Junction', fromCode: 'R', to: 'Bilaspur Junction', toCode: 'BSP' },
  { number: '68727', name: 'Bilaspur - Raipur MEMU', from: 'Bilaspur Junction', fromCode: 'BSP', to: 'Raipur Junction', toCode: 'R' },
  { number: '68724', name: 'Gondia - Raipur MEMU', from: 'Gondia Junction', fromCode: 'G', to: 'Raipur Junction', toCode: 'R' },

  // SECR / Raipur / Chhattisgarh Express Trains
  { number: '12807', name: 'Samata Express', from: 'Visakhapatnam', fromCode: 'VSKP', to: 'Hazrat Nizamuddin', toCode: 'NZM' },
  { number: '12808', name: 'Samata Express', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Visakhapatnam', toCode: 'VSKP' },
  { number: '18237', name: 'Chhattisgarh Express', from: 'Korba', fromCode: 'KRBA', to: 'Amritsar Junction', toCode: 'ASR' },
  { number: '18238', name: 'Chhattisgarh Express', from: 'Amritsar Junction', fromCode: 'ASR', to: 'Korba', toCode: 'KRBA' },
  { number: '12441', name: 'Bilaspur Rajdhani Express', from: 'Bilaspur Junction', fromCode: 'BSP', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12442', name: 'New Delhi Bilaspur Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Bilaspur Junction', toCode: 'BSP' },
  { number: '12823', name: 'Chhattisgarh Sampark Kranti Express', from: 'Durg Junction', fromCode: 'DURG', to: 'Hazrat Nizamuddin', toCode: 'NZM' },
  { number: '12824', name: 'Chhattisgarh Sampark Kranti Express', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Durg Junction', toCode: 'DURG' },
  { number: '18241', name: 'Durg Ambikapur Express', from: 'Durg Junction', fromCode: 'DURG', to: 'Ambikapur', toCode: 'ABKP' },
  { number: '18242', name: 'Ambikapur Durg Express', from: 'Ambikapur', fromCode: 'ABKP', to: 'Durg Junction', toCode: 'DURG' },
  { number: '12853', name: 'Amarkantak Express', from: 'Durg Junction', fromCode: 'DURG', to: 'Bhopal Junction', toCode: 'BPL' },
  { number: '12854', name: 'Amarkantak Express', from: 'Bhopal Junction', fromCode: 'BPL', to: 'Durg Junction', toCode: 'DURG' },
  { number: '12860', name: 'Geetanjali Express', from: 'Howrah Junction', fromCode: 'HWH', to: 'Mumbai CSMT', toCode: 'CSMT' },
  { number: '12859', name: 'Geetanjali Express', from: 'Mumbai CSMT', fromCode: 'CSMT', to: 'Howrah Junction', toCode: 'HWH' },
  { number: '12834', name: 'Howrah Express', from: 'Ahmedabad Junction', fromCode: 'ADI', to: 'Howrah Junction', toCode: 'HWH' },
  { number: '20825', name: 'Bilaspur Vande Bharat Express', from: 'Bilaspur Junction', fromCode: 'BSP', to: 'Nagpur Junction', toCode: 'NGP' },
  { number: '20826', name: 'Nagpur Vande Bharat Express', from: 'Nagpur Junction', fromCode: 'NGP', to: 'Bilaspur Junction', toCode: 'BSP' },
  { number: '18030', name: 'Shalimar Express', from: 'Mumbai LTT', fromCode: 'LTT', to: 'Shalimar', toCode: 'SHM' },
  { number: '12812', name: 'Hatia Express', from: 'Mumbai LTT', fromCode: 'LTT', to: 'Hatia', toCode: 'HTE' },

  // Rajdhani Express
  { number: '12951', name: 'New Delhi Tejas Rajdhani Express', from: 'Mumbai Central', fromCode: 'MMCT', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12952', name: 'Mumbai Tejas Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Mumbai Central', toCode: 'MMCT' },
  { number: '12301', name: 'Howrah Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Howrah', toCode: 'HWH' },
  { number: '12302', name: 'New Delhi Rajdhani Express', from: 'Howrah', fromCode: 'HWH', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12303', name: 'Poorva Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Howrah', toCode: 'HWH' },
  { number: '12309', name: 'Patna Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Patna Junction', toCode: 'PNBE' },
  { number: '12313', name: 'Sealdah Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Sealdah', toCode: 'SDAH' },
  { number: '12431', name: 'Thiruvananthapuram Rajdhani', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Thiruvananthapuram', toCode: 'TVC' },
  { number: '12433', name: 'Chennai Rajdhani Express', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Chennai Central', toCode: 'MAS' },
  { number: '12435', name: 'Dibrugarh Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Dibrugarh', toCode: 'DBRG' },
  { number: '12439', name: 'Ranchi Rajdhani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Ranchi', toCode: 'RNC' },

  // Shatabdi Express
  { number: '12001', name: 'Bhopal Shatabdi Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Bhopal', toCode: 'BPL' },
  { number: '12002', name: 'Bhopal Shatabdi Express', from: 'Habibganj', fromCode: 'HBJ', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12003', name: 'Lucknow Swarna Shatabdi', from: 'New Delhi', fromCode: 'NDLS', to: 'Lucknow', toCode: 'LKO' },
  { number: '12007', name: 'Chennai Shatabdi Express', from: 'Mysuru', fromCode: 'MYS', to: 'Chennai Central', toCode: 'MAS' },
  { number: '12009', name: 'Mumbai Shatabdi Express', from: 'Mumbai Central', fromCode: 'MMCT', to: 'Ahmedabad', toCode: 'ADI' },
  { number: '12011', name: 'Kalka Shatabdi Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Kalka', toCode: 'KLK' },
  { number: '12013', name: 'Amritsar Shatabdi Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Amritsar', toCode: 'ASR' },
  { number: '12015', name: 'Ajmer Shatabdi Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Ajmer', toCode: 'AII' },
  { number: '12017', name: 'Dehradun Shatabdi Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Dehradun', toCode: 'DDN' },
  { number: '12019', name: 'Howrah Shatabdi Express', from: 'Howrah', fromCode: 'HWH', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12023', name: 'Patna Shatabdi Express', from: 'Howrah', fromCode: 'HWH', to: 'Patna Junction', toCode: 'PNBE' },

  // Vande Bharat Express
  { number: '22436', name: 'Varanasi Vande Bharat Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Varanasi Junction', toCode: 'BSB' },
  { number: '22435', name: 'New Delhi Vande Bharat Express', from: 'Varanasi Junction', fromCode: 'BSB', to: 'New Delhi', toCode: 'NDLS' },
  { number: '20901', name: 'Mumbai Vande Bharat Express', from: 'Mumbai CST', fromCode: 'CSMT', to: 'Solapur', toCode: 'SUR' },
  { number: '20903', name: 'Chennai Vande Bharat Express', from: 'Chennai Central', fromCode: 'MAS', to: 'Coimbatore', toCode: 'CBE' },
  { number: '20905', name: 'Patna Vande Bharat Express', from: 'Patna Junction', fromCode: 'PNBE', to: 'Howrah', toCode: 'HWH' },
  { number: '20911', name: 'Rani Kamlapati Vande Bharat', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Rani Kamlapati', toCode: 'HBJ' },
  { number: '22221', name: 'Mumbai Vande Bharat Express', from: 'Mumbai CST', fromCode: 'CSMT', to: 'Shirdi', toCode: 'SAI' },
  { number: '22223', name: 'Amritsar Vande Bharat Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Amritsar', toCode: 'ASR' },
  { number: '22229', name: 'Howrah Vande Bharat Express', from: 'Howrah', fromCode: 'HWH', to: 'New Jalpaiguri', toCode: 'NJP' },
  { number: '22231', name: 'Lucknow Vande Bharat Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Lucknow', toCode: 'LKO' },
  { number: '20951', name: 'Ahmedabad Vande Bharat Express', from: 'Ahmedabad', fromCode: 'ADI', to: 'Mumbai Central', toCode: 'MMCT' },

  // Duronto & Express
  { number: '12259', name: 'Sealdah Duronto Express', from: 'Sealdah', fromCode: 'SDAH', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12260', name: 'New Delhi Duronto Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Sealdah', toCode: 'SDAH' },
  { number: '12263', name: 'Pune Duronto Express', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Pune Junction', toCode: 'PUNE' },
  { number: '12269', name: 'Mumbai Duronto Express', from: 'Chennai Central', fromCode: 'MAS', to: 'Mumbai LTT', toCode: 'LTT' },
  { number: '12621', name: 'Tamil Nadu Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Chennai Central', toCode: 'MAS' },
  { number: '12622', name: 'Tamil Nadu Express', from: 'Chennai Central', fromCode: 'MAS', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12625', name: 'Kerala Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Thiruvananthapuram', toCode: 'TVC' },
  { number: '12626', name: 'Kerala Express', from: 'Thiruvananthapuram', fromCode: 'TVC', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12627', name: 'Karnataka Express', from: 'New Delhi', fromCode: 'NDLS', to: 'KSR Bengaluru City', toCode: 'SBC' },
  { number: '12628', name: 'Karnataka Express', from: 'KSR Bengaluru City', fromCode: 'SBC', to: 'New Delhi', toCode: 'NDLS' },
  { number: '12649', name: 'Karnataka Sampark Kranti', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'KSR Bengaluru City', toCode: 'SBC' },
  { number: '12650', name: 'Karnataka Sampark Kranti', from: 'KSR Bengaluru City', fromCode: 'SBC', to: 'Hazrat Nizamuddin', toCode: 'NZM' },
  { number: '12723', name: 'Telangana Express', from: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Hyderabad', toCode: 'HYB' },
  { number: '12724', name: 'Telangana Express', from: 'Hyderabad', fromCode: 'HYB', to: 'Hazrat Nizamuddin', toCode: 'NZM' },
  { number: '12685', name: 'Mangalore Express', from: 'Chennai Central', fromCode: 'MAS', to: 'Mangalore', toCode: 'MAQ' },
  { number: '12101', name: 'Jnaneshwari Deluxe Express', from: 'Mumbai LTT', fromCode: 'LTT', to: 'Howrah', toCode: 'HWH' },
  { number: '12561', name: 'Swatantrata Senani Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Rajgir', toCode: 'RGR' },
  { number: '12471', name: 'Swaraj Express', from: 'Jammu Tawi', fromCode: 'JAT', to: 'Indore', toCode: 'INDB' },
  { number: '12141', name: 'Patna Express', from: 'Mumbai LTT', fromCode: 'LTT', to: 'Patna Junction', toCode: 'PNBE' },
  { number: '12229', name: 'Lucknow Mail', from: 'New Delhi', fromCode: 'NDLS', to: 'Lucknow', toCode: 'LKO' },
  { number: '12903', name: 'Golden Temple Mail', from: 'Mumbai Central', fromCode: 'MMCT', to: 'Amritsar', toCode: 'ASR' },
  { number: '12401', name: 'Nandan Kanan Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Bhubaneswar', toCode: 'BBS' },
  { number: '22691', name: 'Rajdhani Express', from: 'KSR Bengaluru City', fromCode: 'SBC', to: 'Hazrat Nizamuddin', toCode: 'NZM' },
  { number: '12615', name: 'Grand Trunk Express', from: 'New Delhi', fromCode: 'NDLS', to: 'Chennai Central', toCode: 'MAS' },
  { number: '16315', name: 'Kochuveli Express', from: 'Thiruvananthapuram', fromCode: 'KCVL', to: 'Bangalore City', toCode: 'SBC' },
  { number: '12163', name: 'Dadar Chennai Express', from: 'Dadar', fromCode: 'DR', to: 'Chennai Central', toCode: 'MAS' },
  { number: '12187', name: 'Jabalpur Garib Rath Express', from: 'Mumbai LTT', fromCode: 'LTT', to: 'Jabalpur', toCode: 'JBP' },
  { number: '12953', name: 'August Kranti Rajdhani Express', from: 'Mumbai Central', fromCode: 'MMCT', to: 'Hazrat Nizamuddin', toCode: 'NZM' },
  { number: '15005', name: 'Rapti Sagar Express', from: 'Guwahati', fromCode: 'GHY', to: 'Delhi Anand Vihar', toCode: 'ANVT' },
];

/**
 * Search trains from static database & matching city aliases.
 */
export function searchLocalTrains(query: string): TrainEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return TRAINS_DB.slice(0, 12);

  // Match train number, name, origin, destination, or city name
  return TRAINS_DB.filter(
    (t) =>
      t.number.startsWith(q) ||
      t.name.toLowerCase().includes(q) ||
      t.from.toLowerCase().includes(q) ||
      t.to.toLowerCase().includes(q) ||
      t.fromCode.toLowerCase().includes(q) ||
      t.toCode.toLowerCase().includes(q)
  ).slice(0, 15);
}
