// frontend/src/pages/Carte/components/MapView.tsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Product } from '../types/index.ts';

interface MapViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

type ProductStatus = 'available' | 'out_of_stock' | 'popular';

const markerColors: Record<ProductStatus, string> = {
  available: '#16a34a',   // un peu plus foncé, plus “premium”
  out_of_stock: '#ea580c',
  popular: '#2563eb',
};

function createCustomIcon(status: ProductStatus) {
  const color = markerColors[status];
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" 
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="12" cy="11" r="6" fill="white" opacity="0.95"/>
      <circle cx="12" cy="11" r="3.5" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -44],
  });
}

function getStatus(product: Product): ProductStatus {
  if (product.countInStock <= 0) return 'out_of_stock';
  if (product.rating >= 4.5 && product.reviewCount >= 10) return 'popular';
  return 'available';
}

export default function MapView({ products, onProductClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialisation de la map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [34.5, 9.5],
      zoom: 7,
      zoomControl: false,
      scrollWheelZoom: 'center',
    });

    // Zoom + controle positionné proprement
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tu peux changer le fond OSM par un style plus “léché” (Stadia, Carto, etc.)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!mapReady || !markersRef.current) return;

    markersRef.current.clearLayers();

    const statusConfig: Record<
      ProductStatus,
      { label: string; bg: string; text: string; chipBg: string }
    > = {
      available: {
        label: 'Disponible',
        bg: '#ecfdf3',
        text: '#166534',
        chipBg: 'rgba(22,101,52,0.08)',
      },
      out_of_stock: {
        label: 'En rupture',
        bg: '#fff7ed',
        text: '#9a3412',
        chipBg: 'rgba(154,52,18,0.08)',
      },
      popular: {
        label: 'Populaire',
        bg: '#eff6ff',
        text: '#1d4ed8',
        chipBg: 'rgba(37,99,235,0.08)',
      },
    };

    products.forEach((product) => {
      const status = getStatus(product);
      const icon = createCustomIcon(status);

      const { latitude, longitude } =
        product.location ?? { latitude: 34.5, longitude: 9.5 };

      const marker = L.marker([latitude, longitude], { icon });

      const st = statusConfig[status];
      const rating = product.rating || 0;
      const numReviews = product.reviewCount || 0;

      const stars = [...Array(5)]
        .map(
          (_, i) =>
            `<svg style="width:13px;height:13px;display:inline;margin-right:1px;" viewBox="0 0 20 20" fill="${
              i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb'
            }">
               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
             </svg>`
        )
        .join('');

      const popupContent = `
<div style="
  width:270px;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 18px 40px rgba(15,23,42,0.18);
  background:white;
">
  <div style="position:relative;">
    <img src="${product.images?.[0] || '/placeholder.png'}" 
         alt="${product.name}"
         style="
           width:100%;
           height:150px;
           object-fit:cover;
           display:block;
         "
         onerror="this.src='https://via.placeholder.com/400x300?text=Produit'"/>

    <div style="
      position:absolute;
      inset:0;
      background:linear-gradient(to top,rgba(0,0,0,0.45),transparent);
    "></div>

    <div style="
      position:absolute;
      left:12px;
      right:12px;
      bottom:10px;
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      gap:8px;
    ">
      <div style="flex:1;min-width:0;">
        <p style="
          margin:0;
          font-size:13px;
          font-weight:700;
          color:white;
          text-shadow:0 1px 3px rgba(0,0,0,0.5);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        ">
          ${product.name}
        </p>
        <p style="
          margin:2px 0 0;
          font-size:11px;
          color:#e5e7eb;
          text-shadow:0 1px 2px rgba(0,0,0,0.4);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        ">
          ${product.origin || 'Tunisie'}
        </p>
      </div>

      <div style="
        padding:3px 9px;
        border-radius:999px;
        background:${st.chipBg};
        backdrop-filter:blur(8px);
        color:${st.text};
        font-size:10px;
        font-weight:600;
        display:flex;
        align-items:center;
        gap:5px;
        white-space:nowrap;
      ">
        <span style="
          width:7px;
          height:7px;
          border-radius:999px;
          background:${markerColors[status]};
          box-shadow:0 0 0 3px rgba(255,255,255,0.4);
        "></span>
        ${st.label}
      </div>
    </div>
  </div>

  <div style="padding:12px 12px 10px;">
    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:6px;
    ">
      <div style="display:flex;align-items:center;gap:4px;">
        ${stars}
        <span style="font-size:11px;color:#9ca3af;margin-left:2px;">
          ${rating.toFixed(1)} · ${numReviews} avis
        </span>
      </div>
      <span style="
        font-size:18px;
        font-weight:700;
        color:#16a34a;
      ">
        ${product.price.toFixed(2)} DT
      </span>
    </div>

    <p style="
      font-size:11px;
      color:#6b7280;
      margin:0 0 8px;
      line-height:1.4;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
    ">
      ${product.description || 'Produit du terroir tunisien soigneusement sélectionné.'}
    </p>

    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:8px;
      font-size:11px;
      color:#6b7280;
    ">
      <div style="display:flex;align-items:center;gap:4px;">
        <svg style="width:12px;height:12px;color:#6b7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${product.origin || 'Tunisie'}
      </div>
      <span style="color:#9ca3af;">
        ${product.weight || ''}
      </span>
    </div>

    <button 
      id="view-product-${product._id}"
      style="
        width:100%;
        background:linear-gradient(135deg,#4B2E05,#7C4A10);
        color:white;
        border:none;
        padding:9px 12px;
        border-radius:999px;
        font-size:12px;
        font-weight:600;
        cursor:pointer;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        box-shadow:0 10px 20px rgba(75,46,5,0.35);
        transition:all 0.18s ease-out;
      "
      onmouseover="this.style.transform='translateY(-1px) scale(1.02)';this.style.boxShadow='0 14px 30px rgba(75,46,5,0.45)'"
      onmouseout="this.style.transform='translateY(0) scale(1.0)';this.style.boxShadow='0 10px 20px rgba(75,46,5,0.35)'"
    >
      Voir la fiche complète
    </button>
  </div>
</div>
`;

      const popup = L.popup({
        maxWidth: 290,
        minWidth: 270,
        className: 'custom-popup',
        autoPanPadding: L.point(30, 30),
      }).setContent(popupContent);

      marker.bindPopup(popup);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`view-product-${product._id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              onProductClick(product);
            });
          }
        }, 20);
      });

      marker.addTo(markersRef.current!);
    });
  }, [products, mapReady, onProductClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.20)] overflow-hidden border border-slate-200"
      style={{ minHeight: '520px', background: '#f8fafc' }}
    />
  );
}