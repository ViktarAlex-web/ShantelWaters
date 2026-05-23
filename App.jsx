Here you go! Copy everything below and replace your `src/App.jsx` on GitHub:

```jsx
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://jbthiszwislfoedjcwnx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidGhpc3p3aXNsZm9lZGpjd254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzgzODAsImV4cCI6MjA5NTA1NDM4MH0.pJ4S_0oDrBkIusyeoyhnHHpq_ogBjYq-Rb-OiyHnhu8";
const ADMIN_PASSWORD = "MavhuraS";

const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" };

async function getProducts() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`, { headers });
  return r.json();
}
async function addProduct(data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/products`, { method: "POST", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify(data) });
  return r.json();
}
async function updateProduct(id, data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, { method: "PATCH", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify(data) });
  return r.json();
}
async function deleteProduct(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, { method: "DELETE", headers });
}
async function uploadImage(productId, file) {
  const path = `${productId}-${Date.now()}-${file.name}`;
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${path}`, {
    method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, body: file,
  });
  const d = await r.json();
  if (d.Key) return `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
  return null;
}

const categories = [
  { id: "all", label: "All", icon: "✨" },
  { id: "rings", label: "Midi Rings", icon: "💍" },
  { id: "necklaces", label: "Necklaces", icon: "📿" },
  { id: "phone", label: "Phone Cases", icon: "📱" },
  { id: "wallpapers", label: "Wallpapers", icon: "🌸" },
  { id: "stickers", label: "Stickers", icon: "🎀" },
];

const bgColors = ["bg-purple-100","bg-pink-100","bg-violet-100","bg-fuchsia-100","bg-purple-200","bg-pink-200","bg-violet-200","bg-pink-50"];
const icons = ["💜","🌸","✨","🎀","💍","📿","🦋","🌷"];

function AdminLock({ onUnlock, onClose }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const check = () => {
    if (pw === ADMIN_PASSWORD) { onUnlock(); setError(false); }
    else setError(true);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(59,7,100,0.5)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "white", borderRadius: "24px", padding: "36px", width: "100%", maxWidth: "360px", boxShadow: "0 30px 60px rgba(124,58,237,0.25)", textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔒</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: "700", color: "#3b0764", margin: "0 0 8px" }}>Admin Access</h3>
        <p style={{ fontSize: "13px", color: "#7c3aed", opacity: 0.7, margin: "0 0 20px" }}>Enter your password to make changes</p>
        <input type="password" placeholder="Password" value={pw}
          onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && check()}
          style={{ border: error ? "1.5px solid #e11d48" : "1.5px solid #e9d5ff", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", outline: "none", color: "#4c1d95", width: "100%", boxSizing: "border-box", marginBottom: "8px" }} />
        {error && <p style={{ color: "#e11d48", fontSize: "12px", margin: "0 0 12px" }}>Wrong password, try again 💔</p>}
        <button onClick={check} style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", border: "none", borderRadius: "30px", padding: "12px 32px", fontSize: "14px", fontWeight: "700", cursor: "pointer", width: "100%" }}>Unlock 💜</button>
      </div>
    </div>
  );
}

function ProductCard({ product, index, onUpload, onDelete, isAdmin, onNeedAuth }) {
  const [cart, setCart] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await onUpload(product.id, file);
    setUploading(false);
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ transform: hovered ? "translateY(-6px)" : "translateY(0)", transition: "transform 0.3s ease" }}>
      <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1.5px solid rgba(192,132,252,0.25)", boxShadow: hovered ? "0 20px 40px rgba(168,85,247,0.18)" : "0 4px 20px rgba(168,85,247,0.08)", overflow: "hidden", transition: "box-shadow 0.3s ease" }}>
        <div className={`relative flex items-center justify-center ${bgColors[index % bgColors.length]}`} style={{ height: "200px", overflow: "hidden", position: "relative" }}>
          {product.image_url
            ? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "48px" }}>{icons[index % icons.length]}</span>
                <span style={{ fontSize: "11px", color: "#a855f7", opacity: 0.7 }}>{uploading ? "Uploading 💜" : "No image yet"}</span>
              </div>
          }
          {product.badge && <div style={{ position: "absolute", top: "12px", left: "12px", background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "white", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>{product.badge}</div>}
          <label style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(255,255,255,0.9)", border: "1px solid #e9d5ff", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: hovered ? 1 : 0, transition: "opacity 0.3s", fontSize: "16px" }}>
            {uploading ? "⏳" : "📷"}
            <input type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { if (!isAdmin) { onNeedAuth(); return; } handleFile(e); }} />
          </label>
          <button onClick={() => { if (!isAdmin) { onNeedAuth(); return; } onDelete(product.id); }}
            style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.9)", border: "1px solid #fecdd3", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: hovered ? 1 : 0, transition: "opacity 0.3s", fontSize: "12px", color: "#e11d48" }}>✕</button>
        </div>
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "10px", color: "#7c3aed", margin: "0 0 4px", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "600" }}>{categories.find(c => c.id === product.category)?.label}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: "700", color: "#3b0764", margin: "0 0 12px", lineHeight: "1.3" }}>{product.name}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "20px", fontWeight: "800", background: "linear-gradient(135deg,#7c3aed,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>${Number(product.price).toFixed(2)}</span>
            <button onClick={() => setCart(!cart)} style={{ background: cart ? "linear-gradient(135deg,#7c3aed,#db2777)" : "white", color: cart ? "white" : "#7c3aed", border: "1.5px solid #c084fc", borderRadius: "30px", padding: "6px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>{cart ? "✓ Added" : "+ Cart"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShantelWaters() {
  const [activeCat, setActiveCat] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newP, setNewP] = useState({ name: "", category: "rings", price: "", badge: "" });
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLock, setShowLock] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      Array.isArray(data) ? (setProducts(data), setDbError(false)) : setDbError(true);
    } catch { setDbError(true); }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newP.name || !newP.price) return;
    setSaving(true);
    const result = await addProduct({ name: newP.name, category: newP.category, price: parseFloat(newP.price), badge: newP.badge || "New", image_url: null });
    if (Array.isArray(result) && result[0]) setProducts(prev => [result[0], ...prev]);
    setNewP({ name: "", category: "rings", price: "", badge: "" });
    setShowModal(false);
    setSaving(false);
  };

  const handleUpload = async (id, file) => {
    const url = await uploadImage(id, file);
    if (url) {
      await updateProduct(id, { image_url: url });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, image_url: url } : p));
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p =>
    (activeCat === "all" || p.category === activeCat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#faf5ff 0%,#fdf2f8 40%,#f5f3ff 100%)", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .catbtn{transition:all 0.2s}.catbtn:hover{transform:scale(1.05)}
        .blob1{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(216,180,254,0.35),transparent 70%);top:-100px;left:-100px;pointer-events:none;z-index:0;animation:fb 8s ease-in-out infinite}
        .blob2{position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(249,168,212,0.3),transparent 70%);bottom:-80px;right:-80px;pointer-events:none;z-index:0;animation:fb 10s ease-in-out infinite reverse}
        .blob3{position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(196,181,253,0.25),transparent 70%);top:40%;left:55%;pointer-events:none;z-index:0;animation:fb 12s ease-in-out infinite}
        @keyframes fb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,30px) scale(1.05)}}
        .sp{animation:sp 2s ease-in-out infinite;display:inline-block}
        @keyframes sp{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.3) rotate(15deg)}}
      `}</style>
      <div className="blob1"/><div className="blob2"/><div className="blob3"/>
      {dbError && <div style={{ background: "#fef2f2", borderBottom: "1px solid #fecaca", padding: "10px 24px", textAlign: "center", fontSize: "13px", color: "#dc2626", position: "relative", zIndex: 101 }}>⚠️ Database connection issue.</div>}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,245,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(216,180,254,0.3)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="sp" style={{ fontSize: "22px" }}>🌸</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: "700", background: "linear-gradient(135deg,#7c3aed,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ShantelWaters</span>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {["Shop","About","Contact"].map(i => <a key={i} href="#" style={{ color: "#7c3aed", textDecoration: "none", fontSize: "14px", fontWeight: "500", opacity: 0.8 }}>{i}</a>)}
          <button style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "white", border: "none", borderRadius: "30px", padding: "8px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>🛍️ Cart</button>
        </div>
      </nav>
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "80px 24px 60px" }}>
        <div style={{ display: "inline-block", background: "rgba(216,180,254,0.3)", border: "1px solid rgba(192,132,252,0.4)", borderRadius: "30px", padding: "6px 18px", fontSize: "12px", fontWeight: "600", color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>✨ Cute accessories for every vibe</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(48px,8vw,90px)", fontWeight: "700", lineHeight: "1.05", color: "#3b0764", margin: "0 0 20px", letterSpacing: "-0.03em" }}>
          Your Girly<br/><span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899,#f43f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Wonderland</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#6b21a8", opacity: 0.7, maxWidth: "460px", margin: "0 auto 36px", lineHeight: "1.6" }}>Midi rings, necklaces, phone cases, wallpapers & stickers — all the little things that make life prettier 💜</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("shop").scrollIntoView({ behavior: "smooth" })} style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", border: "none", borderRadius: "40px", padding: "14px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 30px rgba(124,58,237,0.35)" }}>Shop Now 🛍️</button>
          <button style={{ background: "white", color: "#7c3aed", border: "1.5px solid #e9d5ff", borderRadius: "40px", padding: "14px 32px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>New Arrivals ✨</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", marginTop: "60px", flexWrap: "wrap" }}>
          {[["200+","Products"],["5k+","Happy Customers"],["4.9★","Rating"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: "700", background: "linear-gradient(135deg,#7c3aed,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
              <div style={{ fontSize: "12px", color: "#9333ea", opacity: 0.7, fontWeight: "500" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="shop" style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: "700", color: "#3b0764", margin: 0 }}>The Collection 💜</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: "white", border: "1.5px solid #e9d5ff", borderRadius: "30px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🔍</span>
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: "none", outline: "none", fontSize: "13px", color: "#4c1d95", background: "transparent", width: "120px", fontFamily: "'DM Sans',sans-serif" }} />
            </div>
            <button onClick={() => { if (isAdmin) setShowModal(true); else setShowLock(true); }}
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "white", border: "none", borderRadius: "30px", padding: "9px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              {isAdmin ? "🔓 Add Product" : "🔒 Add Product"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "36px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat.id} className="catbtn" onClick={() => setActiveCat(cat.id)} style={{ background: activeCat === cat.id ? "linear-gradient(135deg,#7c3aed,#db2777)" : "rgba(255,255,255,0.8)", color: activeCat === cat.id ? "white" : "#7c3aed", border: activeCat === cat.id ? "none" : "1.5px solid #e9d5ff", borderRadius: "30px", padding: "9px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: activeCat === cat.id ? "0 6px 20px rgba(124,58,237,0.3)" : "none" }}>{cat.icon} {cat.label}</button>
          ))}
        </div>
        {loading
          ? <div style={{ textAlign: "center", padding: "60px", color: "#9333ea" }}>Loading your collection 💜</div>
          : filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "60px", color: "#9333ea", opacity: 0.5 }}>No products found 🌸</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "24px" }}>
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} onUpload={handleUpload} onDelete={handleDelete} isAdmin={isAdmin} onNeedAuth={() => setShowLock(true)} />)}
              </div>
        }
      </section>
      <section style={{ position: "relative", zIndex: 1, margin: "0 auto 80px", borderRadius: "28px", background: "linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#db2777 100%)", padding: "60px 40px", textAlign: "center", maxWidth: "1152px" }}>
        <p style={{ fontSize: "28px", margin: "0 0 8px" }}>🎀</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "40px", fontWeight: "700", color: "white", margin: "0 0 12px" }}>Free Shipping on Orders $30+</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", margin: "0 0 28px" }}>Stack up your favs and we'll deliver straight to your door 💌</p>
        <button style={{ background: "white", color: "#7c3aed", border: "none", borderRadius: "40px", padding: "12px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>Shop & Save ✨</button>
      </section>
      <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 100px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: "700", color: "#3b0764", margin: "0 0 8px" }}>Stay in the Loop 🌸</h2>
        <p style={{ color: "#7c3aed", opacity: 0.7, fontSize: "14px", margin: "0 0 28px" }}>New drops, exclusive deals, and girly inspo — right to your inbox</p>
        {subDone
          ? <div style={{ color: "#7c3aed", fontSize: "16px", fontWeight: "600" }}>💜 You're on the list! Welcome to the fam~</div>
          : <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ background: "white", border: "1.5px solid #e9d5ff", borderRadius: "30px", padding: "12px 24px", fontSize: "14px", outline: "none", color: "#4c1d95", fontFamily: "'DM Sans',sans-serif", width: "260px" }} />
              <button onClick={() => email && setSubDone(true)} style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", border: "none", borderRadius: "30px", padding: "12px 28px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Subscribe 💜</button>
            </div>
        }
      </section>
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(216,180,254,0.3)", padding: "32px 24px", textAlign: "center", background: "rgba(250,245,255,0.6)", backdropFilter: "blur(12px)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: "700", background: "linear-gradient(135deg,#7c3aed,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>ShantelWaters 🌸</div>
        <p style={{ fontSize: "12px", color: "#9333ea", opacity: 0.6 }}>© 2026 ShantelWaters · Made with 💜 · All rights reserved</p>
      </footer>
      {showLock && <AdminLock onUnlock={() => { setIsAdmin(true); setShowLock(false); }} onClose={() => setShowLock(false)} />}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(59,7,100,0.4)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "white", borderRadius: "24px", padding: "36px", width: "100%", maxWidth: "420px", boxShadow: "0 30px 60px rgba(124,58,237,0.25)" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", fontWeight: "700", color: "#3b0764", margin: "0 0 24px" }}>Add New Product ✨</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input placeholder="Product name" value={newP.name} onChange={e => setNewP(p => ({ ...p, name: e.target.value }))} style={{ border: "1.5px solid #e9d5ff", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "'DM Sans',sans-serif", color: "#4c1d95" }} />
              <select value={newP.category} onChange={e => setNewP(p => ({ ...p, category: e.target.value }))} style={{ border: "1.5px solid #e9d5ff", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "'DM Sans',sans-serif", color: "#4c1d95", background: "white" }}>
                {categories.filter(c => c.id !== "all").map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>)}
              </select>
              <input type="number" placeholder="Price e.g. 9.99" value={newP.price} onChange={e => setNewP(p => ({ ...p, price: e.target.value }))} style={{ border: "1.5px solid #e9d5ff", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "'DM Sans',sans-serif", color: "#4c1d95" }} />
              <input placeholder='Badge e.g. "New" or "Hot 🔥" (optional)' value={newP.badge} onChange={e => setNewP(p => ({ ...p, badge: e.target.value }))} style={{ border: "1.5px solid #e9d5ff", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "'DM Sans',sans-serif", color: "#4c1d95" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: "white", color: "#7c3aed", border: "1.5px solid #e9d5ff", borderRadius: "30px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ flex: 2, background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", border: "none", borderRadius: "30px", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving... 💜" : "Add to Shop 💜"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

Go to GitHub → `src/App.jsx` → tap the ✏️ pencil → select all → paste this → commit! 💜
